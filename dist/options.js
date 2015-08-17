(function() {
  var restoreOptions, saveOptions;

  saveOptions = function() {
    return chrome.storage.sync.set({
      token: document.getElementById('token').value
    }, function() {
      var status;
      status = document.getElementById('status');
      status.textContent = 'Options saved.';
      return setTimeout(function() {
        return status.textContent = '';
      }, 750);
    });
  };

  restoreOptions = function() {
    return chrome.storage.sync.get({
      token: ""
    }, function(items) {
      return document.getElementById('token').value = items.token;
    });
  };

  document.addEventListener('DOMContentLoaded', restoreOptions);

  document.getElementById('save').addEventListener('click', saveOptions);

}).call(this);

//# sourceMappingURL=options.js.map
