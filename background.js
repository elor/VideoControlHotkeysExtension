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
    registerTab(tab);
  }
});

chrome.tabs.onCreated.addListener(registerTab);

chrome.action.onClicked.addListener(async (tab) => {
  registerTab(tab);
});

async function registerTab(tab) {
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

          let video = document.querySelector("video");
          let body = document.body;

          let toast = document.createElement('div')
          toast.style.position = 'fixed';
          toast.style.width = '100%';
          toast.style.textAlign = 'center';
          toast.style.color = '#202030';
          toast.style.marginTop = '10em';
          toast.style.paddingTop = '0.1em';
          toast.style.paddingBottom = '0.1em';
          toast.style.fontFamily = 'sans-serif';
          toast.style.fontWeight = 'bold';

          toast.style.borderRadius = '1em';
          toast.style.backgroundColor = '#ffffff40'

          let toastTimeout = undefined;

          function setToast(text, duration_ms) {
            if (toastTimeout) {
              window.clearTimeout(toastTimeout);
            }

            toast.innerText = text;
            body.append(toast);
            toastTimeout = window.setTimeout(() => body.removeChild(toast), duration_ms || 1000);
          }

          setToast("registered", 2000);

          video.addEventListener('keydown', ev => {
            const actions = {
              '<': () => { video.playbackRate -= 0.25; setToast(`Rate: ${video.playbackRate}`) },
              '>': () => { video.playbackRate += 0.25; setToast(`Rate: ${video.playbackRate}`) },
              'k': () => { video.paused ? video.play() : video.pause(); setToast(video.paused ? 'Pause' : 'Play') },
              'j': () => { video.currentTime -= 10 * video.playbackRate; setToast('-10s') },
              'l': () => { video.currentTime += 10 * video.playbackRate; setToast('+10s') },
              'f': () => { video.requestFullscreen(); setToast('fullscreen') },
              '0': () => { video.currentTime = 0; setToast('0%') },
              '1': () => { video.currentTime = 0.1 * video.duration; setToast('10%') },
              '2': () => { video.currentTime = 0.2 * video.duration; setToast('20%') },
              '3': () => { video.currentTime = 0.3 * video.duration; setToast('30%') },
              '4': () => { video.currentTime = 0.4 * video.duration; setToast('40%') },
              '5': () => { video.currentTime = 0.5 * video.duration; setToast('50%') },
              '6': () => { video.currentTime = 0.6 * video.duration; setToast('60%') },
              '7': () => { video.currentTime = 0.7 * video.duration; setToast('70%') },
              '8': () => { video.currentTime = 0.8 * video.duration; setToast('80%') },
              '9': () => { video.currentTime = 0.9 * video.duration; setToast('90%') },
              'c': () => { body.style.cursor = body.style.cursor ? "" : "none"; setToast('cursor') },
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
