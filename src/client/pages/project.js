'use strict';

const randomClass = require('./../../lib/helpers/random-class');
var membership;

$('#home').attr('href', '/project/' + project_slug);
$('#reports').attr('href', '/project/' + project_slug + '/reports');
$('#queries').attr('href', '/project/' + project_slug + '/queries');
$('#members').attr('href', '/project/' + project_slug + '/members');
$('#requests').attr('href', '/project/' + project_slug + '/requests');
$('#manage').attr('href', '/project/' + project_slug + '/manage');
$('#messages').attr('href', '/project/' + project_slug + '/messages');
$('#stats').attr('href', '/project/' + project_slug + '/stats');
$('#edit').attr('href', '/project/' + project_slug + '/edit');
$('#settings').attr('href', '/project/' + project_slug + '/settings');

$('#main-menu-segment').addClass(randomClass());

(async function() {
    try {
        if (!active_user) {
            $('#membership').addClass('disabled');
            return;
        }

        let data = { slug_id: window.slug_id };

        let response = await Promise.resolve(
            $.get('/api/project/' + window.slug_id + '/membership', data)
        );

        if (response.members && response.members.length) {
            //is a member
            membership = true;

            window.is_admin =
                response.members[0].role == 'admin' ||
                response.members[0].role == 'owner';

            $('#membership').html('<i class="user times icon"></i>');
            $('#membership').data('tooltip', 'Leave');

            if (response.members[0].type == 'team') {
                $('#message').addClass('disabled');
                $('#membership').addClass('disabled');
            }

            if (
                response.members[0].state == 'active' &&
                response.members[0].type == 'member'
            ) {
                window.pqy_notify.inform(
                    'Member since: ' +
                        new Date(response.members[0].created).toDateString()
                );

                $('#membership').removeClass('disabled');
            }
            if (response.members[0].state == 'pending') {
                window.pqy_notify.inform(
                    'Awaiting membership approval since: ' +
                        new Date(response.members[0].created).toDateString()
                );

                $('#membership').data('tooltip', 'Leave');
                $('#membership').removeClass('disabled');
            }
        } else {
            //is not a member
            $('#membership').html('<i class="user plus icon"></i>');

            $('#membership').removeClass('disabled');
        }
    } catch (err) {
        window.pqy_notify.warn('Sorry, getting membership');
        console.log(err);
    }
})();

$('#membership').on('click', async function() {
    $('#membership').addClass('disabled');

    if (!membership) {
        try {
            let data = {
                name: window.project_name,
                slug_id: window.slug_id,
            };

            let response = await Promise.resolve(
                $.post('/api/private/create/request', data)
            );

            window.pqy_notify.inform('Request sent successfully');
        } catch (err) {
            window.pqy_notify.warn('Sorry, error sending request');
            console.log(err);
        }
    } else {
        try {
            let data = {
                project_slug_id: window.slug_id,
            };

            let response = await Promise.resolve(
                $.post('/api/private/project/leave_membership', data)
            );

            window.pqy_notify.inform('Left project successfully');
        } catch (err) {
            window.pqy_notify.warn('Sorry, error leaving project');
            console.log(err);
        }
    }
});
