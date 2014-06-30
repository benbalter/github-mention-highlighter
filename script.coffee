class GitHubMentionHighlighter

  userMentions: ->
    mentions = []
    for mention in $(".user-mention")
      $mention = $(mention)
      mentions.push $mention if $mention.text() == "@#{@username}"
    mentions

  teamMentions: ->
    mentions = []
    for mention in $(".team-mention")
      $mention = $(mention)
      members = $mention.attr("aria-label").replace(" and ", " ").split(", ")
      mentions.push $mention if $.inArray(@username, members) != -1
    mentions

  mentions: ->
    $.merge @userMentions(), @teamMentions()

  constructor: ->
    @username = $("#user-links .name").text().trim()
    for $mention in @mentions()
      $mention.addClass("highlight")
      $mention.parents(".timeline-comment").addClass("highlight")
$ ->
  new GitHubMentionHighlighter()
