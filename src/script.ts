import * as $ from "jquery";
import "./style.scss";

interface Options {
  token: string;
  login: string;
  teams: string[];
  lastChecked: number;
}

interface User {
  login: string;
}

class GitHubMentionHighlighter implements Options {
  token = "";
  login = "";
  teams: string[] = [];
  lastChecked = 0;
  checkInterval = 86400000; //1000 * 60 * 60 * 24

  handles(): string[] {
    return this.teams.concat([this.login]);
  }

  mentions(): HTMLElement[] {
    const classes = ".user-mention, .member-mention, .team-mention";
    const handles = this.handles();
    const mentions = $(classes).toArray();

    return mentions.filter((mention) => {
      const text = mention.innerText.toLowerCase();
      return text[0] === "@" && handles.includes(text);
    });
  }

  highlight() {
    const classes = ".timeline-comment, .timeline-entry";
    for (const mention of this.mentions()) {
      const $mention = $(mention);
      $mention.addClass("highlight");
      $mention.parents(classes).addClass("highlight");
    }
  }

  private getUser(successCallback: (User) => void) {
    return $.ajax({
      dataType: "json",
      url: "https://api.github.com/user",
      headers: {
        Authorization: `token ${this.token}`,
      },
      success: (data: User) => {
        successCallback(data);
      },
    });
  }

  private getTeams(successCallback: (teams: string[]) => void) {
    return $.ajax({
      dataType: "json",
      url: "https://api.github.com/user/teams",
      headers: {
        Authorization: `token ${this.token}`,
      },
      success: (data) => {
        const teams: string[] = data.map((team) => {
          const org = team["organization"]["login"].toLowerCase();
          const slug = team.slug.toLowerCase();
          return `@${org}/${slug}`;
        });
        successCallback(teams);
      },
    });
  }

  private getOptions(callback: (Options) => void) {
    return chrome.storage.sync.get(this.options(), (options) => {
      this.token = options.token;
      this.login = options.login;
      this.teams = options.teams;
      this.lastChecked = options.lastChecked;

      callback(options);
    });
  }

  private options(): Options {
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
    this.getUser((user) => {
      this.login = `@${user["login"].toLowerCase()}`;

      this.getTeams((teams: string[]) => {
        this.teams = teams;
        this.lastChecked = Date.now();
        this.setOptions();
        this.highlight();
      });
    });
  }

  shouldUpdate(): boolean {
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
