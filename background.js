const extensions = "https://developer.chrome.com/docs/extensions"
const webstore = "https://developer.chrome.com/docs/webstore"

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log(changeInfo);

  if (changeInfo.url) {
    toggleTab(tab);
  }
});

chrome.tabs.onCreated.addListener(toggleTab);

chrome.action.onClicked.addListener(async (tab) => {
  toggleTab(tab);
});

async function toggleTab(tab) {
  if (tab.url.startsWith("file://") && tab.url.endsWith(".mp4")) {
    // Retrieve the action badge to check if the extension is ON or OFF
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

    const isActive = prevState == "OFF";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: isActive ? "ON" : "OFF",
    });

    if (isActive) {
      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id
        },
        func: () => {
          console.log("video controls attached");

          let video = window.document.querySelector("video");
          let body = window.document.body;

          video.addEventListener('keydown', ev => {
            const actions = {
              '<': () => video.playbackRate -= 0.25,
              '>': () => video.playbackRate += 0.25,
              'k': () => video.paused ? video.play() : video.pause(),
              'j': () => video.currentTime -= 10 * video.playbackRate,
              'l': () => video.currentTime += 10 * video.playbackRate,
              'f': () => video.requestFullscreen(),
              '0': () => video.currentTime = 0,
              '1': () => video.currentTime = 0.1 * video.duration,
              '2': () => video.currentTime = 0.2 * video.duration,
              '3': () => video.currentTime = 0.3 * video.duration,
              '4': () => video.currentTime = 0.4 * video.duration,
              '5': () => video.currentTime = 0.5 * video.duration,
              '6': () => video.currentTime = 0.6 * video.duration,
              '7': () => video.currentTime = 0.7 * video.duration,
              '8': () => video.currentTime = 0.8 * video.duration,
              '9': () => video.currentTime = 0.9 * video.duration,
              'c': () => body.style.cursor = body.style.cursor ? "" : "none",
            }

            let action = actions[ev.key];

            if (action) {
              action()
            }
          });
        }
      })
    } else {
      // TODO: Remove attached listeners!
    }
  }
}
