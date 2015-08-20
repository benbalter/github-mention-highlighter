saveOptions = ->
  chrome.storage.sync.set
    token: document.getElementById('token').value,
    lastChecked: 0 # force a refresh on next load
  , ->
    status = document.getElementById('status')
    status.textContent = 'Options saved.'
    setTimeout ->
      status.textContent = ''
    , 750

restoreOptions = ->
  chrome.storage.sync.get
    token: "",
  , (items) ->
    document.getElementById('token').value = items.token

document.addEventListener 'DOMContentLoaded', restoreOptions
document.getElementById('save').addEventListener 'click', saveOptions
