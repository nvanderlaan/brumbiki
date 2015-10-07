function UserExperience(keywords) {
   this.loadingAnimation = function() {
    $("#loading-text").html("Loading...")
    $("#loading-container").show();
  };

  this.emptyOneDegreeContainers = function() {
    $("#one-degree-drawing-container").hide();
    $('#target-container').find('*').not('.type-text-left').remove();
    $('#primary-container').find('*').not('.type-text-right').remove();
    $('#secondary-container').find('*').not('.type-text-left').remove();
    $('#tertiary-container').find('*').not('.type-text-right').remove();
  };

  this.hideOneDegreeButton = function() {
    $("#one-degree-button-container").fadeOut("slow");
  };

  this.emptySearchResults = function() {
    $("#search-results-container").find("*").not("#keyword-container, .keyword-tracker").remove();
  };

  this.contentSetup = function() {
    $("#content-container").show();
    $("#keyword-container").empty();
    $("#tweets-container").empty();
    $("#welcome-container").fadeOut("slow");
  };

  this.animateBody = function(topHeight, bottomTop, bottomHeight, speed) {
    $("#top-container").animate({ height: topHeight }, speed);
    $("#bottom-container").animate({ top: bottomTop, height: bottomHeight }, speed);
  };
};
