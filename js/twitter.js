var twitter = (function() {
  function escapeHtml(str) {
    return $('<div/>').text(str).html();
  }
  function render(target, tweets) {
    var i = 0, fragment = '', t = $(target)[0];

    for(i = 0; i < tweets.length; ++i) {
      fragment += '<li><i class="fa fa-star"></i><a href="https://twitter.com/seii_saintway/status/' + tweets[i].id + '">'
          + tweets[i].created_at.replace('T', '　').replace('.000Z', '　UTC') + '</a><p>' + escapeHtml(tweets[i].text||'') + '</p></li>';
    }
    t.innerHTML = fragment;
  }
  return {
    showTweets: function(options) {
      options.blacklist = options.blacklist.split(',');
      $.ajax({
          url: 'https://jhub.name/tweets/?tweet.fields=created_at&max_results=' + options.count
        , dataType: 'json'
        , error: function (err) { $(options.target + ' li.loading').addClass('error').text('Error loading feed'); }
        , success: function (data) {
          if (!data ) { return; }
          var tweets = [];
          for (var i = 0; i < data.data.length; ++i) {
            if (options.blacklist instanceof Array && options.blacklist.indexOf(data.data[i].id) !== -1) { continue; }
            tweets.push(data.data[i]);
          }
          render(options.target, tweets);
        }
      });
    }
  };
})();
