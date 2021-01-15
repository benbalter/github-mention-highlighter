const defaultOptions = {
  token: "",
  lastChecked: 0,
};

const saveBtn = <HTMLButtonElement>document.getElementById("save");
const token = <HTMLInputElement>document.getElementById("token");
const statusEl = <HTMLElement>document.getElementById("status");

const saveOptions = () => {
  chrome.storage.sync.set({token: token.value}, () => {
    if (statusEl) {
      statusEl.innerText = "Options saved.";
      setTimeout(() => (statusEl.innerText = ""), 750);
    }
  });
}
const restoreOptions = () =>
  chrome.storage.sync.get(defaultOptions, (items) => {
    if (token) {
      token.value = items.token;
    }
  });

document.addEventListener("DOMContentLoaded", restoreOptions);

if (saveBtn) {
  saveBtn.addEventListener("click", saveOptions);
}
