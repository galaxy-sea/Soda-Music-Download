(function (globalScope) {
  "use strict";

  const DOWNLOAD_BUTTON_ID = "soda-music-download-button";
  const DEFAULT_MAX_ATTEMPTS = 120;
  const DEFAULT_INTERVAL_MS = 500;

  function sanitizeFilenamePart(value) {
    return String(value || "")
      .trim()
      .replace(/[\\/:*?"<>|]/g, "_")
      .replace(/\s+/g, " ")
      .replace(/^\.+$/, "")
      .slice(0, 120);
  }

  function inferExtension(audioUrl) {
    try {
      const parsedUrl = new URL(audioUrl);
      const pathExtension = parsedUrl.pathname.match(/\.(mp3|m4a|mp4|flac|wav|ogg|aac|opus)$/i)?.[0];
      if (pathExtension) {
        return pathExtension.toLowerCase();
      }

      const mimeType = parsedUrl.searchParams.get("mime_type") || "";
      if (/audio_mp4|audio\/mp4|mp4/i.test(mimeType)) {
        return ".m4a";
      }
      if (/mpeg|mp3/i.test(mimeType)) {
        return ".mp3";
      }
      if (/flac/i.test(mimeType)) {
        return ".flac";
      }
      if (/wav/i.test(mimeType)) {
        return ".wav";
      }
      if (/ogg/i.test(mimeType)) {
        return ".ogg";
      }
    } catch {
      // Fall through to the default extension.
    }

    return ".m4a";
  }

  function buildFilename(track) {
    const artistName = sanitizeFilenamePart(track.artistName) || "Unknown Artist";
    const trackName = sanitizeFilenamePart(track.trackName) || "Unknown Track";
    const audioUrl = track.url;
    const extension = inferExtension(audioUrl);
    return `${artistName}-${trackName}${extension}`;
  }

  function buildTrackLoaderUrl(pageUrl) {
    const parsedUrl = new URL(pageUrl);
    const trackId = parsedUrl.searchParams.get("track_id");
    if (!trackId) {
      return "";
    }

    const loaderUrl = new URL("https://music.douyin.com/qishui/share/track");
    loaderUrl.searchParams.set("track_id", trackId);
    loaderUrl.searchParams.set("__loader", "track_page");
    loaderUrl.searchParams.set("__ssrDirect", "true");
    return loaderUrl.toString();
  }

  function normalizeTrack(option) {
    if (!option?.url) {
      return null;
    }

    return {
      url: option.url,
      artistName: option.artistName || "Unknown Artist",
      trackName: option.trackName || "Unknown Track",
    };
  }

  function findAudioWithLyricsOption(value) {
    if (!value || typeof value !== "object") {
      return null;
    }

    if (value.audioWithLyricsOption?.url) {
      return value.audioWithLyricsOption;
    }

    if (value.url && (value.artistName || value.trackName)) {
      return value;
    }

    for (const childValue of Object.values(value)) {
      const option = findAudioWithLyricsOption(childValue);
      if (option) {
        return option;
      }
    }

    return null;
  }

  function parseJsonText(text) {
    const trimmedText = String(text || "").trim().replace(/^\)\]\}',?\s*/, "");
    return JSON.parse(trimmedText);
  }

  function parseTrackLoaderText(text) {
    const payload = parseJsonText(text);
    return normalizeTrack(findAudioWithLyricsOption(payload));
  }

  async function fetchTrackFromLoader(pageWindow, requestText) {
    const loaderUrl = buildTrackLoaderUrl(pageWindow.location.href);
    if (!loaderUrl) {
      return null;
    }

    const text = await requestText(loaderUrl);
    return parseTrackLoaderText(text);
  }

  function createDownloadButton(onClick) {
    const button = document.createElement("span");
    button.id = DOWNLOAD_BUTTON_ID;
    button.textContent = "立即下载";
    button.title = "下载当前歌曲";
    button.style.cssText = [
      "display:inline-flex",
      "align-items:center",
      "margin-left:12px",
      "padding:4px 10px",
      "border-radius:4px",
      "background:#ff2c55",
      "color:#fff",
      "font-size:14px",
      "font-weight:500",
      "line-height:20px",
      "cursor:pointer",
      "vertical-align:middle",
      "user-select:none",
    ].join(";");

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onClick(event);
    });

    return button;
  }

  function installDownloadButton(options) {
    const {
      onDownload,
      pageWindow = globalScope,
      loadTrack = () =>
        fetchTrackFromLoader(pageWindow, async (loaderUrl) => {
          const response = await fetch(loaderUrl, { credentials: "include" });
          if (!response.ok) {
            throw new Error(`Loader request failed: ${response.status}`);
          }
          return response.text();
        }),
      maxAttempts = DEFAULT_MAX_ATTEMPTS,
      intervalMs = DEFAULT_INTERVAL_MS,
      preventDuplicate = false,
    } = options;
    const seenAudioUrls = new Set();
    let attempts = 0;
    let scheduled = false;
    let retryTimer = null;

    async function handleClick(event) {
      const button = event.currentTarget;
      const originalText = button.textContent;
      button.textContent = "获取中...";

      let track = null;
      try {
        track = await loadTrack();
      } catch (error) {
        console.error("[Soda(qishui) Music Download] Failed to load track:", error);
      } finally {
        button.textContent = originalText;
      }

      if (!track) {
        globalScope.alert("音频信息获取失败，请稍后再试。");
        return;
      }

      if (preventDuplicate && seenAudioUrls.has(track.url)) {
        return;
      }

      seenAudioUrls.add(track.url);
      onDownload(track);
    }

    function findTitle() {
      return document.querySelector(".track-title h1") || document.querySelector("h1");
    }

    function ensureDownloadButton() {
      scheduled = false;

      const title = findTitle();
      const existingButton = document.getElementById(DOWNLOAD_BUTTON_ID);

      if (!title) {
        existingButton?.remove();
        return false;
      }

      if (existingButton?.previousElementSibling === title) {
        return true;
      }

      existingButton?.remove();
      title.insertAdjacentElement("afterend", createDownloadButton(handleClick));
      return true;
    }

    function scheduleEnsureDownloadButton() {
      if (scheduled) {
        return;
      }

      scheduled = true;
      globalScope.setTimeout(ensureDownloadButton, 50);
    }

    const observer = new MutationObserver(scheduleEnsureDownloadButton);
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true,
    });

    function retryInsertDownloadButton() {
      attempts += 1;

      if (ensureDownloadButton() || attempts >= maxAttempts) {
        globalScope.clearInterval(retryTimer);
      }
    }

    retryTimer = globalScope.setInterval(retryInsertDownloadButton, intervalMs);
    retryInsertDownloadButton();

    return {
      disconnect() {
        observer.disconnect();
        globalScope.clearInterval(retryTimer);
      },
      refresh: ensureDownloadButton,
    };
  }

  globalScope.SodaMusicDownloadUtils = {
    sanitizeFilenamePart,
    inferExtension,
    buildFilename,
    buildTrackLoaderUrl,
    parseTrackLoaderText,
    fetchTrackFromLoader,
    installDownloadButton,
  };
})(globalThis);
