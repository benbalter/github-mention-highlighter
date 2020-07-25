import * as $ from "jquery";
import "./style.scss";

class GitHubMentionHighlighter {
  token: string = "";
  login: string = "";
  teams: Array<string> = [];
  lastChecked: number = 0;
  checkInterval: number = 86400000; //1000 * 60 * 60 * 24

  mentions() {
    const handles = this.teams.concat([this.login]);
    const classes = ".user-mention, .member-mention, .team-mention";
    let mentions = $(classes)
      .toArray()
      .map((mention) => {
        return $(mention);
      });

    return mentions.filter((mention) => {
      const text = mention.text().toLowerCase();
      return text[0] === "@" && handles.includes(text);
    });
  }

  highlight() {
    const classes = ".timeline-comment, .timeline-entry";
    for (let mention of this.mentions()) {
      mention.addClass("highlight");
      mention.parents(classes).addClass("highlight");
    }
  }

  private getUser(successCallback: Function) {
    return $.ajax({
      dataType: "json",
      url: "https://api.github.com/user",
      headers: {
        Authorization: `token ${this.token}`,
      },
      success: (data) => {
        successCallback(data);
      },
    });
  }

  private getTeams(successCallback: Function) {
    return $.ajax({
      dataType: "json",
      url: "https://api.github.com/user/teams",
      headers: {
        Authorization: `token ${this.token}`,
      },
      success: (data) => {
        successCallback(data);
      },
    });
  }

  private getOptions(callback: Function) {
    return chrome.storage.sync.get(this.options(), (options) => {
      this.token = options.token;
      this.login = options.login;
      this.teams = options.teams;
      this.lastChecked = options.lastChecked;

      callback();
    });
  }

  private options() {
    return {
      token: this.token,
      login: this.login,
      teams: this.teams,
      lastChecked: this.lastChecked,
    };
  }

  private setOptions() {
    chrome.storage.sync.set(this.options());
  }

  update() {
    this.getUser((data) => {
      this.login = `@${data["login"].toLowerCase()}`;

      this.getTeams((teams) => {
        this.teams = teams.map((team) => {
          const org = team["organization"]["login"].toLowerCase();
          const slug = team["slug"].toLowerCase();
          return `@${org}/${slug}`;
        });

        this.lastChecked = Date.now();
        this.setOptions();
        this.highlight();
      });
    });
  }

  shouldUpdate() {
    return Date.now() > this.lastChecked + this.checkInterval;
  }

  constructor() {
    this.getOptions(() => {
      if (this.token === "") {
        return console.warn(
          "GitHub Mention Highlighter: Please specify a personal access token via the options page."
        );
      }

      if (this.shouldUpdate()) {
        this.update();
      } else {
        this.highlight();
      }
    });
  }
}

new GitHubMentionHighlighter();
