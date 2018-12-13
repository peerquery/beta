$(window).on('load', function() {
    var Editor = require('../../lib/editor'),
        config = require('../../configs/config');

    window.Editor = Editor;

    Editor.disable_image_upload();

    //jquery is already universal through the `scripts.js` global file

    $('.limitedText').on('keyup', function() {
        var maxLength = $(this).attr('maxlength');
        if (maxLength == $(this).val().length) {
            pqy_notify.warn(
                'You can\'t write more than ' + maxLength + ' characters'
            );
        }
    });

    $('#update').on('click', async function() {
        try {
            let data = {};

            data.title = document.getElementById('query-title').value;
            if (data.title == '') {
                pqy_notify.warn('Please enter title');
                document.getElementById('query-title').focus();
                return;
            }

            data.image = document.getElementById('queryImage').value;
            if (data.image)
                data.image =
                    data.image.indexOf('://') === -1
                        ? 'http://' + data.image
                        : data.image;

            data.description = document.getElementById(
                'queryDescription'
            ).value;
            if (data.description == '') {
                pqy_notify.warn('Please enter description');
                document.getElementById('queryDescription').focus();
                return;
            }

            data.telephone = document.getElementById('queryTelephone').value;

            data.email = document.getElementById('queryEmail').value;

            data.website = document.getElementById('queryWebsite').value;
            if (data.website)
                data.website =
                    data.website.indexOf('://') === -1
                        ? 'http://' + data.website
                        : data.website;

            data.type = document.getElementById('queryType').value;
            if (data.type == '') {
                pqy_notify.warn('Please enter type');
                document.getElementById('queryType').focus();
                return;
            }

            data.reward_form = document.getElementById('queryRewardForm').value;
            if (data.reward_form == '') {
                pqy_notify.warn('Please enter reward form');
                document.getElementById('queryRewardForm').focus();
                return;
            }

            data.label = document
                .getElementById('queryLabel')
                .value.toLowerCase()
                .replace(/\W+/g, ' ')
                .split(' ')[0];
            if (data.label == '') {
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
                data.deadline = new Date(deadline);
                if (data.deadline <= new Date()) {
                    pqy_notify.warn('Deadline must be older than current time');
                    document.getElementById('queryDeadline').focus();
                    return;
                }
            }

            data.body = $('<div />')
                .html(Editor.setup.getMarkdown())
                .find('span')
                .contents()
                .unwrap()
                .end()
                .end()
                .html();

            if (data.title.length < 5) {
                pqy_notify.warn('Please enter a longer title!');
                return;
            }

            $(this).addClass('disabled');
            $('#update').addClass('disabled');
            $('#delete').addClass('disabled');
            $('#cancel').addClass('disabled');
            $('#form').addClass('loading');

            data.permlink = window.permlink;
            data.project_slug_id = window.project_slug_id;

            var response = await Promise.resolve(
                $.post('/api/private/query/update', data)
            );

            window.location.href = '/query/' + window.permlink;

            //console.log(response);
        } catch (err) {
            console.log(err);
            pqy_notify.warn('Sorry, an error occured. Please again');
            window.location.reload();
        }
    });

    $('#deleteBtn').on('click', async function() {
        try {
            $(this).addClass('disabled');
            $('#update').addClass('disabled');
            $('#delete').addClass('disabled');
            $('#form').addClass('loading');

            let data = {};
            data.permlink = window.permlink;
            data.project_slug_id = window.project_slug_id;

            var response = await Promise.resolve(
                $.post('/api/private/query/delete', data)
            );

            window.location.href = '/queries';

            //console.log(response);
        } catch (err) {
            console.log(err);
            pqy_notify.warn('Sorry, an error occured. Please again');
            window.location.reload();
        }
    });
});
