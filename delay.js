const params = new URLSearchParams(window.location.search);
const site = params.get("site");
const targetUrl = params.get("target");

let delaySeconds = 15;
chrome.storage.sync.get(['delaySeconds'], (data) => {
  delaySeconds = data.delaySeconds || 15;
  let countdown = delaySeconds;
  document.getElementById("countdown").textContent = countdown;

  const interval = setInterval(() => {
    countdown--;
    document.getElementById("countdown").textContent = countdown;
    if (countdown <= 0) {
      clearInterval(interval);
      chrome.storage.session.set({ skipDelay: true }).then(() => {
      window.location.href = targetUrl;
});
    }
  },1000);

  const todayKey = `time_${site}_${new Date().toDateString()}`;
  chrome.storage.local.get([todayKey], (result) => {
    const spent = Math.floor((result[todayKey] || 0) / 1000);
    document.getElementById("timeSpent").textContent = `${spent} seconds`;
  });
});