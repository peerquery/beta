$(window).on('load', function() {
    //jquery is already universal through the `scripts.js` global file

    (async function export_data(type) {
        try {
            var response = await Promise.resolve(
                $.get('/api/project/' + project_slug + '/stats')
            );

            let report_count = response.overview
                ? response.overview.report_count || 0
                : 0;
            let query_count = response.overview
                ? response.overview.query_count || 0
                : 0;

            let member_count = response.overview
                ? response.overview.member_count || 0
                : 0;
            let pending_count = response.pending[0]
                ? response.pending[0].pending_count || 0
                : 0;
            let team_count = response.team[0]
                ? response.team[0].team_count || 0
                : 0;

            //overview
            $('#report_count').text(report_count);
            $('#query_count').text(query_count);
            $('#activity-section').show();

            //community
            $('#member_count').text(member_count);
            $('#pending_count').text(pending_count);
            $('#team_count').text(team_count);
            $('#community-section').show();

            $('#stats-loader').hide();
        } catch (err) {
            console.log(err);
            window.pqy_notify.warn('Sorry, an error occured. Please again');
        }
    })();
});
