class GitHubMentionHighlighter

  mentions: ->
    haystack = [@options["login"]].concat @options["teams"]
    mentions = []
    for mention in $(".user-mention, .member-mention, .team-mention, a")
      $mention = $(mention)
      text = $mention.text().toLowerCase()
      mentions.push $mention if text[0] == "@" && text in haystack
    mentions

  highlight: ->
    for $mention in @mentions()
      $mention.addClass("highlight")
      $mention.parents(".timeline-comment, .timeline-entry").addClass("highlight")

  update: ->
    $.ajax
      dataType: 'json'
      url: "https://api.github.com/user"
      headers: 
        Authorization: "token #{@options["token"]}"
      success: (data) =>
        @options["login"] = "@#{data["login"].toLowerCase()}"

        $.ajax
          dataType: 'json'
          url: "https://api.github.com/user/teams"
          headers: 
            Authorization: "token #{@options["token"]}"
          success: (data) =>
            @options["teams"] = data.map (team) ->
              "@#{team["organization"]["login"].toLowerCase()}/#{team["slug"].toLowerCase()}"

          @options["lastChecked"] = Date.now()
          chrome.storage.sync.set @options, =>
            @highlight()

  constructor: ->
    chrome.storage.sync.get
      token: "",
      login: "",
      teams: [],
      lastChecked: 0
    , (items) =>
      @options = items

      if @options["token"] == ""
        console.warn "GitHub Mention Highlighter: Please specify a personal access token via the options page."
      if Date.now() > @options["lastChecked"] + (1000 * 60 * 60 * 24)
        @update()
      else
        @highlight()
$ ->
  new GitHubMentionHighlighter()
