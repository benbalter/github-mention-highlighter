class GitHubMentionHighlighter

  mentions: ->
    haystack = [@options["login"]].concat @options["teams"]
    mentions = []
    for mention in $(".user-mention, .member-mention, .team-mention, a")
      $mention = $(mention)
      text = $mention.text()
      mentions.push $mention if text[0] == "@" && text in haystack
    mentions

  highlight: ->
    console.log @options
    console.log @mentions()
    for $mention in @mentions()
      $mention.addClass("highlight")
      $mention.parents(".timeline-comment, .timeline-entry").addClass("highlight")

  update: ->
    $.getJSON "https://api.github.com/user?access_token=#{@options["token"]}", (data) =>
      @options["login"] = "@#{data["login"]}"

      $.getJSON "https://api.github.com/user/teams?access_token=#{@options["token"]}", (data) =>
        @options["teams"] = data.map (team) ->
          "@#{team["organization"]["login"]}/#{team["slug"]}"

        @options["lastChecked"] = Date.now()
        chrome.storage.sync.set @options, =>
          @highlight()

  constructor: ->
    console.log "LOADED"
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
