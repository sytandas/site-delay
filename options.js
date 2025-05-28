const siteInput = document.getElementById("site");
const addSiteBtn = document.getElementById("addSite");
const siteList = document.getElementById("siteList");
const delayInput = document.getElementById("delaySeconds");

function renderSites(sites) {
  siteList.innerHTML = '';
  sites.forEach((site, index) => {
    const li = document.createElement("li");
    li.textContent = site;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => {
      sites.splice(index, 1);
      chrome.storage.sync.set({ trackedSites: sites }, () => renderSites(sites));
    };
    li.appendChild(removeBtn);
    siteList.appendChild(li);
  });
}

chrome.storage.sync.get(['trackedSites', 'delaySeconds'], (data) => {
  renderSites(data.trackedSites || []);
  delayInput.value = data.delaySeconds || 30;
});

addSiteBtn.onclick = () => {
  const site = siteInput.value.trim();
  if (!site) return;
  chrome.storage.sync.get(['trackedSites'], (data) => {
    const sites = data.trackedSites || [];
    if (!sites.includes(site)) {
      sites.push(site);
      chrome.storage.sync.set({ trackedSites: sites }, () => renderSites(sites));
    }
  });
};

delayInput.onchange = () => {
  chrome.storage.sync.set({ delaySeconds: parseInt(delayInput.value, 10) });
};