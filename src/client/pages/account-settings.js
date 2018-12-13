'use strict';

$('#hiringBtn').click(function() {
    //slightly throttle use of feature by disabling upon save, to re-use user must reload page
    $(this).addClass('disabled');

    var state = window.get_checked_data('hiring');

    var update = {
        type: 'hiring',
        value: state,
    };

    $.post('/api/private/user/settings/update', update, function(data, status) {
        pqy_notify.success('Successfully updated account data.');
    }).fail(function(err) {
        pqy_notify.warn('An error occurred, pleased try again.');
        //console.log(err.statusText);
    });
});

$('#benefactormessageBtn').click(function() {
    //slightly throttle use of feature by disabling upon save, to re-use user must reload page
    $(this).addClass('disabled');

    var update = {
        title: $('#benefactormessageTitle').val(),
        body: $('#benefactormessageBody').val(),
    };

    if (!update.title) {
        pqy_notify.warn(
            'Benefactor"s thank you message title cannot be empty.'
        );
    } else if (!update.body) {
        pqy_notify.warn('Benefactor"s thank you message body cannot be empty.');
    } else {
        $.post(
            '/api/private/settings/update/benefactor_message',
            update,
            function(data, status) {
                pqy_notify.success('Successfully updated account data.');
            }
        ).fail(function(err) {
            pqy_notify.warn('An error occurred, pleased try again.');
            //console.log(err.statusText);
        });
    }
});

$('#messagingBtn').click(function() {
    //slightly throttle use of feature by disabling upon save, to re-use user must reload page
    $(this).addClass('disabled');

    var state = window.get_checked_data('messaging');

    var update = {
        type: 'messaging',
        value: state,
    };

    $.post('/api/private/user/settings/update', update, function(data, status) {
        pqy_notify.success('Successfully updated account data.');
    }).fail(function(err) {
        pqy_notify.warn('An error occurred, pleased try again.');
        //console.log(err.statusText);
    });
});
