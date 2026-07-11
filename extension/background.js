const DOWNLOAD_MESSAGE = "SODA_MUSIC_DOWNLOAD";
const LOAD_TRACK_MESSAGE = "SODA_MUSIC_LOAD_TRACK";
const WELCOME_PAGE = "shared/welcome.html";

if (typeof SodaMusicDownloadUtils === "undefined" && typeof importScripts === "function") {
  importScripts("shared/download-utils.js");
}

function openWelcomePage() {
  chrome.tabs.create({
    url: chrome.runtime.getURL(WELCOME_PAGE),
  });
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "install") {
    return;
  }

  openWelcomePage();
});

chrome.action.onClicked.addListener(openWelcomePage);

function downloadTrack(track) {
  return new Promise((resolve, reject) => {
    chrome.downloads.download(
      {
        url: track.url,
        filename: SodaMusicDownloadUtils.buildFilename(track),
        conflictAction: "uniquify",
        saveAs: false,
      },
      (downloadId) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(new Error(error.message));
          return;
        }
        resolve(downloadId);
      }
    );
  });
}

function isAllowedLoaderUrl(loaderUrl) {
  try {
    const parsedUrl = new URL(loaderUrl);
    return (
      parsedUrl.origin === "https://music.douyin.com" &&
      parsedUrl.pathname === "/qishui/share/track" &&
      parsedUrl.searchParams.get("__loader") === "track_page" &&
      parsedUrl.searchParams.get("__ssrDirect") === "true" &&
      Boolean(parsedUrl.searchParams.get("track_id"))
    );
  } catch {
    return false;
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === LOAD_TRACK_MESSAGE && message.loaderUrl) {
    if (!isAllowedLoaderUrl(message.loaderUrl)) {
      sendResponse({ ok: false, error: "Invalid loader URL." });
      return false;
    }

    fetch(message.loaderUrl, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Loader request failed: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        sendResponse({
          ok: true,
          track: SodaMusicDownloadUtils.parseTrackLoaderText(text),
        });
      })
      .catch((error) => sendResponse({ ok: false, error: error.message }));

    return true;
  }

  if (message?.type !== DOWNLOAD_MESSAGE || !message.track?.url) {
    return false;
  }

  downloadTrack(message.track)
    .then((downloadId) => sendResponse({ ok: true, downloadId }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
