class TweetsController < ApplicationController

  def index
    tweets = Tweet.all_tweets(params[:handle])
    status = (tweets == "404 Not Found") ? 404 : 200
    current_user.update_attributes(target_tweets: tweets) if status == 200
    render json: tweets, status: status
  end

end
