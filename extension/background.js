const DOWNLOAD_MESSAGE = "SODA_MUSIC_DOWNLOAD";
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== DOWNLOAD_MESSAGE || !message.track?.url) {
    return false;
  }

  downloadTrack(message.track)
    .then((downloadId) => sendResponse({ ok: true, downloadId }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
