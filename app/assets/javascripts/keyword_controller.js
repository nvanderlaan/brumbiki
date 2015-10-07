function KeywordController(keywords) {
  this.tweet = "";

  this.tweetFor = function(keywordButton) {
    return $(keywordButton).parent().parent().find(".tweet-container");
  };

  this.toggleKeyword = function(keywordButton, keywords) {
    if (this.tweetFor(keywordButton)[0] != this.tweet[0]){
      keywords = [];
      $(".keyword").removeClass("active-keyword");
      $("#keyword-container").empty();
    }
  };

  this.removeKeyword = function(keywordButton, keywords) {
    this.tweet = this.tweetFor(keywordButton);
    var value = $(keywordButton).val();
    var index = keywords.indexOf(value);

    if (index > -1) {
      keywords.splice(index, 1)
      $(keywordButton).removeClass("active-keyword")

      if (keywords.length === 0 || keywords.first === "") {
        $("#search-results-container").find("*").not("#keyword-container, .keyword-tracker").remove();
      }
    } else {
      $(keywordButton).addClass("active-keyword");
      keywords.push(value);
    }
  };
};
