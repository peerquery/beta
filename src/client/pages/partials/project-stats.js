$(window).on('load', function() {
    //jquery is already universal through the `scripts.js` global file

    (async function export_data(type) {
        try {
            var response = await Promise.resolve(
                $.get('/api/project/' + project_slug + '/stats')
            );

            //overview
            $('#report_count').text(response.overview.report_count);
            $('#query_count').text(response.overview.query_count);
            $('#activity-section').show();

            //community
            $('#member_count').text(response.overview.member_count);
            $('#pending_count').text(response.pending[0].pending_count);
            $('#team_count').text(response.team[0].team_count);
            $('#community-section').show();

            $('#stats-loader').hide();
        } catch (err) {
            console.log(err);
            window.pqy_notify.warn('Sorry, an error occured. Please again');
        }
    })();
});
