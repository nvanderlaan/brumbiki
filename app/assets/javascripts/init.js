$(document).ready(function() {

  var keywords = [];
  var userExperience = new UserExperience();
  var keywordController = new KeywordController();
  var tweets = new TweetsCollection();
  var tweetsView = new TweetsView({ collection: tweets });

  function getSearchResults(twitterHandle) {
    var query = keywords.join(' ')
    var results = new SearchResultsCollection();
    var resultsCollectionView = new SearchResultsView({ collection: results });

    if (query.length > 0) {
      results.fetch({
        reset: true,
        data: $.param({ query: query, handle: twitterHandle })
      });
    }
  };

  $("#nav-brumbiki").on("click", function(event) {
    event.preventDefault();

    location = "/";
  });

  $(".search-form").on("submit", function(event) {
    event.preventDefault();

    var twitterHandle = $("#search-bar").val();

    userExperience.loadingAnimation();
    userExperience.hideOneDegreeButton();
    userExperience.emptyOneDegreeContainers();
    userExperience.emptySearchResults();
    userExperience.contentSetup();
    userExperience.animateBody("35%", "35%", "65%", 2500);

    tweets.fetch({
      reset: true,
      data: $.param({ handle: twitterHandle }),
      success: function() {
        $("#loading-container").hide();
      },
      error: function() {
        $("#loading-text").html("You searched for someone who doesn't exist in Twitter's database. Check your spelling and try again!")
      }
    });
  });

  $("#tweets-container").on("click", ".keyword", function(event) {
    event.preventDefault();

    var twitterHandle = $("#search-bar").val();
    var text = $(this).val();

    keywordController.toggleKeyword(this, keywords);
    keywordController.removeKeyword(this, keywords);

    if ($(this).hasClass("active-keyword")) {
      $("#keyword-container").append("<input class='keyword-tracker' type='submit' value=" + text + ">")
    } else {
      $('.keyword-tracker').filter(function() {
        return $(this).val() === text;
      }).css("display", "none");
    }

    getSearchResults(twitterHandle);
  });

  $("body").on("click", ".keyword-tracker", function(event) {
    event.preventDefault();

    var twitterHandle = $("#search-bar").val();
    var text = $(this).val();

    $(this).remove();
    keywordController.removeKeyword($('.keyword').filter(function() {
      return $(this).val() === text
    }), keywords);

    getSearchResults(twitterHandle);
  });

  $("#tweets-container").delegate(".keyword", "mouseover", function(event) {
    event.preventDefault();

    $(this).toggleClass("active-keyword-lite", 200);
  }).delegate(".keyword", "mouseout", function() {
    $(this).toggleClass("active-keyword-lite", 200);
  });

  $("#one-degree-button").on("click", function(event) {
    event.preventDefault();

    var twitterUsers = new TwitterUsersCollection();
    var twitterUsersView = new TwitterUsersView({ collection: twitterUsers });

    userExperience.hideOneDegreeButton();
    userExperience.animateBody("70%", "70%", "30%", 1000);

    twitterUsers.fetch({
      reset: true
    });
  });

  $(".type-containers").hover(function() {
    $(this).children(".type-text-right, .type-text-left").css("background-color", "#D93240");
  }, function() {
    $(".type-text-right, .type-text-left").css("background-color", "#242464");
  });

  $("#minimize-button").on("click", function(event) {
    event.preventDefault();

    userExperience.emptyOneDegreeContainers();
    userExperience.animateBody("35%", "35%", "65%", 2500);
    $("#one-degree-button-container").delay(2500).fadeIn("slow");
  });

});
