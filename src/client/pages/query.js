'use strict';

const markup = require('markup-builder'),
    templator = require('../../client/templator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

(async () => {
    try {
        //parse and render query body
        $('#body').html(await markup.build.content($('#temp').html()));
        $('#temp').remove();

        //list popular_queries in sidebar
        let popular_api = '/api/fetch/queries/popular/short';

        var popular_queries = await Promise.resolve($.get(popular_api));

        if (
            !popular_queries ||
            popular_queries == '' ||
            popular_queries.length == 0
        ) {
            $('#loader').hide();
            return;
        }

        for (let x in popular_queries) {
            popular_queries[x].created = timeago.format(
                popular_queries[x].created
            );

            if (popular_queries[x].title.length > 70)
                popular_queries[x].title =
                    popular_queries[x].title.substr(0, 70) + '...';

            let query = await templator.sidebar_query(popular_queries[x]);
            $('#popular-container').append(query);
        }

        $('#loader').hide();

        //list new_queries in sidebar
        var new_api = '/api/fetch/queries/new/short';

        var new_queries = await Promise.resolve($.get(new_api));

        if (!new_queries || new_queries == '' || new_queries.length == 0) {
            $('#loader').hide();
            return;
        }

        for (let x in new_queries) {
            new_queries[x].created = timeago.format(new_queries[x].created);

            if (new_queries[x].title.length > 70)
                new_queries[x].title =
                    new_queries[x].title.substr(0, 70) + '...';

            let query = await templator.sidebar_query(new_queries[x]);
            $('#new-container').append(query);
        }

        $('#new_segment').show();
    } catch (err) {
        console.log(err);
    }
})();
