$(window).on('load', function() {
    //jquery is already universal through the `scripts.js` global file

    var create_request = require('./../../../lib/creators/requests');

    async function display_requests() {
        try {
            $('#requests-loader').show();

            var all_requests = await Promise.resolve(
                $.get('/api/project/' + project_slug + '/requests')
            );

            var requests = all_requests[0].requests;

            for (var x in requests) {
                var request = await create_request(requests[x]);
                $('#requests-container').append(request);
            }

            $('#requests-loader').hide();
        } catch (err) {
            window.pqy_notify.warn('Sorry, error fetching requests');
            $('#requests-loader').hide();
            console.log(err);
        }
    }

    display_requests();

    $('#requests-container').on('click', '.approve', async function() {
        try {
            let elm = this;
            let account = $(elm).data('account');
            $(elm).addClass('disabled');

            let data = {
                project_slug_id: window.slug_id,
                account: account,
            };

            let response = await Promise.resolve(
                $.post('/api/private/project/approve_membership', data)
            );

            $('#' + account + '-item').remove();

            window.pqy_notify.inform('Successfully added new member');
        } catch (err) {
            window.pqy_notify.warn('Sorry, error approving new member');
            console.log(err);
        }
    });

    $('#requests-container').on('click', '.reject', async function() {
        try {
            let elm = this;
            let account = $(elm).data('account');
            $(elm).addClass('disabled');

            let data = {
                project_slug_id: window.slug_id,
                account: account,
            };

            let response = await Promise.resolve(
                $.post('/api/private/project/reject_membership', data)
            );

            $('#' + account + '-item').remove();

            window.pqy_notify.warn('Successfully declined user request');
        } catch (err) {
            window.pqy_notify.warn('Sorry, error rejecting user');
            console.log(err);
        }
    });
});
