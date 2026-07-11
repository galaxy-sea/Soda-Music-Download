(() => {
  const EVENT_TYPE = "SODA_MUSIC_DOWNLOAD_TRACK";
  const LOAD_TRACK_REQUEST_TYPE = "SODA_MUSIC_LOAD_TRACK_REQUEST";
  const LOAD_TRACK_RESPONSE_TYPE = "SODA_MUSIC_LOAD_TRACK_RESPONSE";
  const seenAudioUrls = new Set();

  function injectScript(filename, onload) {
    const target = document.documentElement || document.head;
    if (!target) {
      window.setTimeout(() => injectScript(filename, onload), 50);
      return;
    }

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(filename);
    script.onload = () => {
      script.remove();
      onload?.();
    };
    target.appendChild(script);
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) {
      return;
    }

    if (event.data?.type === LOAD_TRACK_REQUEST_TYPE) {
      chrome.runtime.sendMessage(
        {
          type: "SODA_MUSIC_LOAD_TRACK",
          loaderUrl: event.data.loaderUrl,
        },
        (response) => {
          const runtimeError = chrome.runtime.lastError;
          window.postMessage(
            {
              type: LOAD_TRACK_RESPONSE_TYPE,
              requestId: event.data.requestId,
              track: response?.track || null,
              error: runtimeError?.message || response?.error || "",
            },
            window.location.origin
          );
        }
      );
      return;
    }

    if (event.data?.type !== EVENT_TYPE) {
      return;
    }

    const track = event.data.track;
    if (!track?.url || seenAudioUrls.has(track.url)) {
      return;
    }

    seenAudioUrls.add(track.url);
    chrome.runtime.sendMessage({
      type: "SODA_MUSIC_DOWNLOAD",
      track,
    });
  });

  injectScript("shared/download-utils.js", () => injectScript("page.js"));
})();
