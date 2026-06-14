(() => {
  const EVENT_TYPE = "SODA_MUSIC_DOWNLOAD_TRACK";

  SodaMusicDownloadUtils.installDownloadButton({
    pageWindow: window,
    onDownload(track) {
      window.postMessage({ type: EVENT_TYPE, track }, window.location.origin);
    },
  });
})();
