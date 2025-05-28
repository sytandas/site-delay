(async function () {
  const { trackedSites = ["youtube.com"], delaySeconds = 15 } = await chrome.storage.sync.get(['trackedSites', 'delaySeconds']);
  const matched = trackedSites.find(site => window.location.hostname.includes(site));
  const delayPageUrl = chrome.runtime.getURL("delay.html");

  // Do not run on delay.html itself
  if (!matched || window.location.href.startsWith(delayPageUrl)) return;

  // Intercept link clicks
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const url = new URL(link.href);
    if (!url.hostname.includes(matched)) return; // Only intercept links to same tracked site

    e.preventDefault(); // stop default navigation

    const delayUrl = `${delayPageUrl}?site=${encodeURIComponent(matched)}&target=${encodeURIComponent(link.href)}`;
    window.location.href = delayUrl;
  });

  // First page load (not from clicking a link)
  const visitedKey = `visited_${matched}`;
  const currentUrl = window.location.href;
  const visited = JSON.parse(sessionStorage.getItem(visitedKey) || "[]");

  if (!visited.includes(currentUrl)) {
    visited.push(currentUrl);
    sessionStorage.setItem(visitedKey, JSON.stringify(visited));
    const delayUrl = `${delayPageUrl}?site=${encodeURIComponent(matched)}&target=${encodeURIComponent(currentUrl)}`;
    window.location.href = delayUrl;
  }
})();
