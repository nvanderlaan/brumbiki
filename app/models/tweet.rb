class Tweet

  include Clientable

  attr_reader :target_id, :target_handle, :target_name, :target_description, :user_mentions, :target_profile_image_url, :tweet_id

  def initialize(attributes)
    @tweet_id = attributes[:tweet_id]
    @target_id = attributes[:target_id]
    @target_handle = attributes[:target_handle]
    @target_name = attributes[:target_name]
    @target_description = attributes[:target_description]
    @created_at = attributes[:created_at]
    @user_mentions = attributes[:user_mentions]
    @text = attributes[:text]
    @target_profile_image_url = attributes[:target_profile_image_url]
    @links = attributes[:links]
    @text_keywords = attributes[:text_keywords]
    @title_keywords = attributes[:title_keywords]
  end

  def self.all_tweets(handle)
    begin
      Clientable.client.user_timeline(handle, { count: 40, include_rts: false }).map do |tweet|
        Tweet.new(self.tweet_info(tweet))
      end
    rescue => e
      "404 Not Found"
    end
  end

  protected

  def self.tweet_info(tweet)
    text = self.tweet_text(tweet)
    links = self.tweet_links(tweet)
    blacklist = self.load_blacklist
    tweet_text_keywords = self.text_keywords(text, blacklist)
    tweet_title_keywords = self.title_keywords(links, blacklist) - tweet_text_keywords

    {
      tweet_id: tweet.id.to_s,
      target_id: tweet.user.id,
      target_handle: tweet.user.screen_name,
      target_name: tweet.user.name,
      target_description: tweet.user.description,
      created_at: self.format_created_at(tweet),
      user_mentions: tweet.user_mentions,
      text: text,
      target_profile_image_url: self.profile_image_url(tweet),
      links: links,
      text_keywords: tweet_text_keywords,
      title_keywords: tweet_title_keywords
    }
  end

  def self.tweet_text(tweet)
    words = tweet.text.split(" ")
    words.delete_if { |word| word.match(/^\s*(#|$)|\b(http.*|https.*)\b/) }
    words.join(" ")
  end

  def self.tweet_links(tweet)
    urls = self.expanded_urls(tweet)
    urls.map { |url| Link.new(url) }
  end

  def self.expanded_urls(tweet)
    tweet.urls.map { |url| url.expanded_url.to_s }
  end

  def self.format_created_at(tweet)
    tweet.created_at.strftime("%B %-d, %Y")
  end

  def self.profile_image_url(tweet)
    tweet.user.profile_image_url.to_s
  end

  def self.text_keywords(text, blacklist)
    new_text = Highscore::Content.new(text, blacklist)
    new_text.keywords.rank.map { |keyword| keyword.text.downcase }
  end

  def self.title_keywords(links, blacklist)
    keywords = links.map do |link|
      return [] if link.title.match(/^\s*(#|$)|\b(http.*|https.*)\b/)
      title = Highscore::Content.new(link.title, blacklist)
      title.keywords.rank.map { |keyword| keyword.text.downcase }
    end
    keywords.flatten
  end

  def self.load_blacklist
    Highscore::Blacklist.load("again why to and also then equally uniquely like as too moreover very really totally actually when can this you are is that were the our for might near left what if have com out from pre lot had nice been with all would could should did but here his them they find says how ours any side itself via btw lol likewise comparatively correspondingly similarly furthermore additionally")
  end

end
