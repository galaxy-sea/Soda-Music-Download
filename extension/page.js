(() => {
  const EVENT_TYPE = "SODA_MUSIC_DOWNLOAD_TRACK";
  const LOAD_TRACK_REQUEST_TYPE = "SODA_MUSIC_LOAD_TRACK_REQUEST";
  const LOAD_TRACK_RESPONSE_TYPE = "SODA_MUSIC_LOAD_TRACK_RESPONSE";
  let nextRequestId = 1;

  function loadTrack() {
    const loaderUrl = SodaMusicDownloadUtils.buildTrackLoaderUrl(window.location.href);
    if (!loaderUrl) {
      return Promise.resolve(null);
    }

    const requestId = String(nextRequestId++);

    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        window.removeEventListener("message", handleResponse);
        reject(new Error("Load track request timed out."));
      }, 15000);

      function handleResponse(event) {
        if (
          event.source !== window ||
          event.data?.type !== LOAD_TRACK_RESPONSE_TYPE ||
          event.data.requestId !== requestId
        ) {
          return;
        }

        window.clearTimeout(timeout);
        window.removeEventListener("message", handleResponse);

        if (event.data.error) {
          reject(new Error(event.data.error));
          return;
        }

        resolve(event.data.track || null);
      }

      window.addEventListener("message", handleResponse);
      window.postMessage(
        {
          type: LOAD_TRACK_REQUEST_TYPE,
          requestId,
          loaderUrl,
        },
        window.location.origin
      );
    });
  }

  SodaMusicDownloadUtils.installDownloadButton({
    pageWindow: window,
    loadTrack,
    onDownload(track) {
      window.postMessage({ type: EVENT_TYPE, track }, window.location.origin);
    },
  });
})();
