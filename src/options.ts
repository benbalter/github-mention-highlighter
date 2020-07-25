import * as $ from "jquery";

const saveOptions = () =>
  chrome.storage.sync.set(
    {
      token: $("#token").val(),
      lastChecked: 0,
    }, // force a refresh on next load
    function () {
      const status = $("#status");
      status.text("Options saved.");
      return setTimeout(() => status.text(""), 750);
    }
  );

const restoreOptions = () =>
  chrome.storage.sync.get({ token: "" }, (items) =>
    $("#token").val(items.token)
  );

$("#save").click(saveOptions);
$(restoreOptions);
