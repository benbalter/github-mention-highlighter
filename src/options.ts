const token = <HTMLInputElement>document.getElementById("token");
const options = {
  token: token.value,
  lastChecked: 0,
};

const saveOptions = () =>
  chrome.storage.sync.set(options, () => {
    const status = <HTMLInputElement>document.getElementById("status");
    status.innerText = "Options saved.";
    setTimeout(() => (status.innerText = ""), 750);
  });

const restoreOptions = () =>
  chrome.storage.sync.get(options, (items) => {
    token.value = items.token;
  });

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
