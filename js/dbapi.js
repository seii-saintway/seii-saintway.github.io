var dbapi = (function() {
    var render = function (infos) {
        var html = '';
        for(var i = 0; i < infos.length; ++i) {
            var detail = infos[i]['book'];
            var title = detail['title'];
            var link = detail['alt'];
//          var image = detail['image'];
            html += '<i class="fa fa-file-text-o"></i><a href="' + link + '" target="_blank">' + title + '</a>';
        }
        return html;
    };

    var getURL = function (status, begin, count) {
        var url = 'https://api.douban.com/v2/book/user/' + opts.user + '/collections';
        url += '?status=' + status + '&start=' + begin + '&count=' + count;
        if (opts.api.length > 0) url += '&apikey=' + opts.api;
        return url;
    };

    var appendInfos = function (item, total) {
        if(total > item.maxCount) total = item.maxCount;
        for(var i = 0; i < total; i += 100) {
            $.ajax({
                url: getURL(item.status, i, 100),
                dataType: 'jsonp',
                success: function (data) { $('#book_' + item.status).append(render(data['collections'])); }
            });
        }
    };

    var opts = {
        target: 'douban',
        user: 'metaphilosophy',
        api: '0df993c66c0c636e29ecbb5344252a4a',
        count: [{status: 'reading', maxCount: 20}, {status: 'read', maxCount: 200}, {status: 'wish', maxCount: 200}],
        readingTitle: 'What am I reading?',
        readTitle: 'What did I read?',
        wishTitle: 'What do I wish to read?'
    };

    return {
        showBooks: function() {
            var h = $('#' + opts.target);
            if(h.length === 0) h = $('<ul/>').attr('id', opts.target).prependTo($('body'));
            for(var i = 0; i < opts.count.length; ++i) {
                var item = opts.count[i];
                if($('#book_' + item.status).length === 0) {
                    $('<li/>').text(opts[item.status + 'Title']).prepend($('<i/>').attr('class', 'fa fa-star')).appendTo(h);
                    $('<li/>').attr('id', 'book_' + item.status).addClass('douban-list').appendTo(h);
                }
                $.ajax({
                    url: getURL(item.status, 0, 1),
                    dataType: 'jsonp',
                    error: function (err) { $('#book_' + this.item.status).addClass('error').text('Error loading feed'); },
                    success: function (data) { appendInfos(this.item, data['total']); },
                    item: item
                });
            }
        }
    };
})();
