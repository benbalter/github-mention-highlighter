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
    $.getJSON "https://api.github.com/user?access_token=#{@options["token"]}", (data) =>
      @options["login"] = "@#{data["login"].toLowerCase()}"

      $.getJSON "https://api.github.com/user/teams?access_token=#{@options["token"]}", (data) =>
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

      if Date.now() > @options["lastChecked"] + (1000 * 60 * 60)
        @update()
      else
        @highlight()
$ ->
  new GitHubMentionHighlighter()
