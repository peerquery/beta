'use strict';

$('#welcomemessageBtn').click(function() {
    //slightly throttle use of feature by disabling upon save, to re-use user must reload page
    $(this).addClass('disabled');

    var update = {
        title: $('#welcomemessageTitle').val(),
        body: $('#welcomemessageBody').val(),
        slug_id: slug_id,
    };

    if (!update.title) {
        pqy_notify.warn('Welcome message title cannot be empty.');
    } else if (!update.body) {
        pqy_notify.warn('Welcome message body cannot be empty.');
    } else {
        $.post(
            '/api/private/project/compliments/welcome_message',
            update,
            function(data, status) {
                pqy_notify.success('Successfully updated project data.');
            }
        ).fail(function(err) {
            pqy_notify.warn('An error occurred, pleased try again.');
            //console.log(err.statusText);
        });
    }
});

$('#benefactormessageBtn').click(function() {
    //slightly throttle use of feature by disabling upon save, to re-use user must reload page
    $(this).addClass('disabled');

    var update = {
        title: $('#benefactormessageTitle').val(),
        body: $('#benefactormessageBody').val(),
        slug_id: slug_id,
    };

    if (!update.title) {
        pqy_notify.warn(
            'Benefactor"s thank you message title cannot be empty.'
        );
    } else if (!update.body) {
        pqy_notify.warn('Benefactor"s thank you message body cannot be empty.');
    } else {
        $.post(
            '/api/private/project/compliments/benefactor_message',
            update,
            function(data, status) {
                pqy_notify.success('Successfully updated project data.');
            }
        ).fail(function(err) {
            pqy_notify.warn('An error occurred, pleased try again.');
            //console.log(err.statusText);
        });
    }
});

window.onload = async function() {
    try {
        var response = await Promise.resolve(
            $.get('/api/private/project/' + slug_id + '/compliments')
        );

        $('#welcomemessageSegment').removeClass('loading');
        $('#benefactormessageSegment').removeClass('loading');

        $('#welcomemessageTitle').val(response.new_member_message_title || '');
        $('#welcomemessageBody').val(response.new_member_message_body || '');

        $('#benefactormessageTitle').val(
            response.new_benefactor_message_title || ''
        );
        $('#benefactormessageBody').val(
            response.new_benefactor_message_body || ''
        );

        //console.log(response);
    } catch (err) {
        console.log(err);
        pqy_notify.warn('Sorry, an error occured. Please again');
        window.location.reload();
    }
};
