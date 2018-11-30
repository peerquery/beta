'use strict';

var create_member = require('./../../../lib/creators/member');
var create_team = require('./../../../lib/creators/team');

async function display_team() {
    try {
        $('#users-loader').show();

        var all_team = await Promise.resolve(
            $.get('/api/project/' + project_slug + '/team')
        );
        var team = all_team[0].team;

        for (var x in team) {
            var teamer = await create_team(team[x]);
            $('#team-container').append(teamer);
        }

        $('#members-loader').hide();
        $('#team-segment').show();
        display_members();
    } catch (err) {
        window.pqy_notify.warn('Sorry, error fetching team');
        $('#members-loader').hide();
        display_members();
        console.log(err);
    }
}

async function display_members() {
    try {
        var all_members = await Promise.resolve(
            $.get('/api/project/' + project_slug + '/members')
        );
        var members = all_members[0].members;

        for (var x in members) {
            var member = await create_member(members[x]);
            $('#members-container').append(member);
        }
    } catch (err) {
        window.pqy_notify.warn('Sorry, error fetching members');
        console.log(err);
    }
}

$('#upgrade_user_btn').on('click', async function() {
    try {
        let account = $(this).data('account');
        $(this).addClass('disabled');

        let data = {
            project_slug_id: window.slug_id,
            account: account,
        };

        let response = await Promise.resolve(
            $.post('/api/private/project/upgrade_membership', data)
        );

        $('#' + account + '-item').remove();

        window.pqy_notify.inform('Successfully upgraded member');

        //$('.ui.modal.manage').modal('hide');
    } catch (err) {
        window.pqy_notify.warn('Sorry, error upgrading member');
        console.log(err);
    }
});

$('#delete_user_btn').on('click', async function() {
    try {
        let account = $(this).data('account');
        $(this).addClass('disabled');

        let data = {
            project_slug_id: window.slug_id,
            account: account,
        };

        let response = await Promise.resolve(
            $.post('/api/private/project/remove_membership', data)
        );

        $('#' + account + '-item').remove();

        window.pqy_notify.inform('Successfully removed member');

        //$('.ui.modal.manage').modal('hide');
    } catch (err) {
        window.pqy_notify.warn('Sorry, error removing member');
        console.log(err);
    }
});

$(window).on('load', function() {
    display_team();
});
