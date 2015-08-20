(function() {
  var GitHubMentionHighlighter,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  GitHubMentionHighlighter = (function() {
    GitHubMentionHighlighter.prototype.mentions = function() {
      var $mention, haystack, mention, mentions, text, _i, _len, _ref;
      haystack = [this.options["login"]].concat(this.options["teams"]);
      mentions = [];
      _ref = $(".user-mention, .member-mention, .team-mention, a");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mention = _ref[_i];
        $mention = $(mention);
        text = $mention.text().toLowerCase();
        if (text[0] === "@" && __indexOf.call(haystack, text) >= 0) {
          mentions.push($mention);
        }
      }
      return mentions;
    };

    GitHubMentionHighlighter.prototype.highlight = function() {
      var $mention, _i, _len, _ref, _results;
      _ref = this.mentions();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        $mention = _ref[_i];
        $mention.addClass("highlight");
        _results.push($mention.parents(".timeline-comment, .timeline-entry").addClass("highlight"));
      }
      return _results;
    };

    GitHubMentionHighlighter.prototype.update = function() {
      return $.getJSON("https://api.github.com/user?access_token=" + this.options["token"], (function(_this) {
        return function(data) {
          _this.options["login"] = "@" + (data["login"].toLowerCase());
          return $.getJSON("https://api.github.com/user/teams?access_token=" + _this.options["token"], function(data) {
            _this.options["teams"] = data.map(function(team) {
              return "@" + (team["organization"]["login"].toLowerCase()) + "/" + (team["slug"].toLowerCase());
            });
            _this.options["lastChecked"] = Date.now();
            return chrome.storage.sync.set(_this.options, function() {
              return _this.highlight();
            });
          });
        };
      })(this));
    };

    function GitHubMentionHighlighter() {
      chrome.storage.sync.get({
        token: "",
        login: "",
        teams: [],
        lastChecked: 0
      }, (function(_this) {
        return function(items) {
          _this.options = items;
          if (Date.now() > _this.options["lastChecked"] + (1000 * 60 * 60 * 24)) {
            return _this.update();
          } else {
            return _this.highlight();
          }
        };
      })(this));
    }

    return GitHubMentionHighlighter;

  })();

  $(function() {
    return new GitHubMentionHighlighter();
  });

}).call(this);

//# sourceMappingURL=script.js.map
