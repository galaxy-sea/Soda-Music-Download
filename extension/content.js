(() => {
  const EVENT_TYPE = "SODA_MUSIC_DOWNLOAD_TRACK";
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
    if (event.source !== window || event.data?.type !== EVENT_TYPE) {
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
