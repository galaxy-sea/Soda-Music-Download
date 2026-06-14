const DOWNLOAD_MESSAGE = "SODA_MUSIC_DOWNLOAD";

if (typeof SodaMusicDownloadUtils === "undefined" && typeof importScripts === "function") {
  importScripts("shared/download-utils.js");
}

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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== DOWNLOAD_MESSAGE || !message.track?.url) {
    return false;
  }

  downloadTrack(message.track)
    .then((downloadId) => sendResponse({ ok: true, downloadId }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
