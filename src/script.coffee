class GitHubMentionHighlighter

  userMentions: ->
    mentions = []
    for mention in $(".user-mention, .member-mention")
      $mention = $(mention)
      mentions.push $mention if $mention.text() == "@#{@username}"
    mentions

  teamMentions: ->
    mentions = []
    members = []
    for mention in $(".team-mention")
      $mention = $(mention)
      if $mention.attr("aria-label")
        members = $mention.attr("aria-label").replace(" and ", " ").split(", ")
      else if $mention.data("url")
        $.ajax
          url: $mention.data("url")
          async: false
          dataType: 'json'
          cache: true
          success: (data) =>
            members = data["members"]
      mentions.push $mention if $.inArray(@username, members) != -1
    mentions

  mentions: ->
    $.merge @userMentions(), @teamMentions()

  constructor: ->
    @username = $(".supportocat a, #user-links .name").text().trim()

    for $mention in @mentions()
      $mention.addClass("highlight")
      $mention.parents(".timeline-comment, .timeline-entry").addClass("highlight")

$ ->
  new GitHubMentionHighlighter()
