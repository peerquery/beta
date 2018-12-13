'use strict';

var Editor = require('../../lib/editor'),
    config = require('../../configs/config');

require('semantic-ui-calendar/dist/calendar.min.css');
//jquery is already universal through the `ui.js` global file

$(window).on('load', async function() {
    var user_projects;

    //set up editor
    window.Editor = Editor;
    Editor.disable_image_upload();
    Editor.auto_save();

    $('#publish').on('click', function() {
        publish();
    });

    async function publish() {
        //publish function goes here
        var project_title;

        const project_slug_id = $('#projectSelect')
            .find(':selected')
            .val();
        if (project_slug_id !== '') {
            project_title = user_projects.filter(
                e => e.slug_id === project_slug_id
            )[0];

            project_title = project_title.title || project_title.name;
        } else {
            project_title = '';
        }

        const title = document.getElementById('query-title').value;
        if (title == '') {
            pqy_notify.warn('Please enter title');
            document.getElementById('query-title').focus();
            return;
        }

        var image = document.getElementById('queryImage').value;
        if (image)
            image = image.indexOf('://') === -1 ? 'http://' + image : image;

        const description = document.getElementById('queryDescription').value;
        if (description == '') {
            pqy_notify.warn('Please enter description');
            document.getElementById('queryDescription').focus();
            return;
        }

        const telephone = document.getElementById('queryTelephone').value;

        const email = document.getElementById('queryEmail').value;

        var website = document.getElementById('queryWebsite').value;
        if (website)
            website =
                website.indexOf('://') === -1 ? 'http://' + website : website;

        const type = document.getElementById('queryType').value;
        if (type == '') {
            pqy_notify.warn('Please enter type');
            document.getElementById('queryType').focus();
            return;
        }

        const rewardForm = document.getElementById('queryRewardForm').value;
        if (rewardForm == '') {
            pqy_notify.warn('Please enter reward form');
            document.getElementById('queryRewardForm').focus();
            return;
        }

        const label = document
            .getElementById('queryLabel')
            .value.toLowerCase()
            .replace(/\W+/g, ' ')
            .split(' ')[0];
        if (label == '') {
            pqy_notify.warn('Please enter label');
            document.getElementById('queryLabel').focus();
            return;
        }

        //const deadline = document.getElementById('queryDeadline').value;        //deadline is assigned from the script on the page itself
        if (deadline == '') {
            pqy_notify.warn('Please enter deadline');
            document.getElementById('queryDeadline').focus();
            return;
        } else {
            let temp = new Date(deadline);
            if (temp <= new Date()) {
                pqy_notify.warn('Deadline must be older than current time');
                document.getElementById('queryDeadline').focus();
                return;
            }
        }

        const author = active_user;

        const tlink = title
            .replace(/\W+/g, ' ')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
        const permlink =
            tlink +
            '-' +
            (Date.now().toString(36) +
                Math.random()
                    .toString(36)
                    .substr(2, 5));

        const body = $('<div />')
            .html(Editor.setup.getMarkdown())
            .find('span')
            .contents()
            .unwrap()
            .end()
            .end()
            .html();

        if (title.length < 5) {
            pqy_notify.warn('Please enter a longer title!');
            return;
        }

        document.getElementById('form').className = 'ui loading form';

        $('#publish').addClass('disabled');
        do_publish(
            author,
            permlink,
            title,
            body,
            project_slug_id,
            project_title,
            email,
            telephone,
            rewardForm,
            website,
            label,
            type,
            deadline,
            image,
            description
        );
    }

    async function do_publish(
        author,
        permlink,
        title,
        body,
        project_slug_id,
        project_title,
        email,
        telephone,
        rewardForm,
        website,
        label,
        type,
        deadline,
        image,
        description
    ) {
        //console.log('Success!', results);
        //now ping the server with update
        try {
            var data = {};
            if (project_slug_id !== '') data.project_slug_id = project_slug_id;
            if (project_title !== '') data.project_title = project_title;
            data.title = title;
            data.body = body;
            data.permlink = permlink;
            data.telephone = telephone;
            data.email = email;
            data.website = website;
            data.rewardForm = rewardForm;
            data.label = label;
            data.type = type;
            data.deadline = deadline;
            data.image = image;
            data.description = description;

            var status = await Promise.resolve(
                $.post('/api/private/create/query', data)
            );
            //console.log(status);

            //clear backup from localStorage
            var content_type = window.location.pathname.split('/')[2];
            if (!content_type) content_type = 'comment';
            window.localStorage.removeItem(content_type);

            window.location.href = '/query/' + permlink;
        } catch (err) {
            console.log(err);
            pqy_notify.warn(
                'Sorry, an error occured updating the server. However, the query has been successfully published to your Steem account.'
            );
            window.location.href = '/query/' + permlink;
        }
    }

    (async function() {
        $.getJSON('/api/private/projects/team/list', null, function(data) {
            user_projects = data;
            //$("#projectSelect option").remove(); // Remove all <option> child tags.

            $('#projectField').removeClass('disabled');
            $.each(data, function(index, item) {
                // Iterates through a collection
                $('#projectSelect').append(
                    // Append an object to the inside of the select box
                    $('<option></option>') // Yes you can do this.
                        .text(item.name || item.title)
                        .val(item.slug_id)
                );
            });
        });
    })();

    $('.limitedText').on('keyup', function() {
        var maxLength = $(this).attr('maxlength');
        if (maxLength == $(this).val().length) {
            pqy_notify.warn(
                'You can\'t write more than ' + maxLength + ' characters'
            );
        }
    });
});
