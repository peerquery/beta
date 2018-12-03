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
