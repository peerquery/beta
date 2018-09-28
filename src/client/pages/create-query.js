'use strict';

var sc2 = require('steemconnect'),
    Editor = require('../../lib/editor'),
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
                e => e.slug === project_slug_id
            )[0].title;
        } else {
            project_title = '';
        }

        const title = document.getElementById('query-title').value;
        if (title == '') {
            window.pqy_notify.warn('Please enter title');
            document.getElementById('query-title').focus();
            return;
        }

        const image = document.getElementById('queryImage').value;
        if (image == '') {
            window.pqy_notify.warn('Please enter image');
            document.getElementById('queryImage').focus();
            return;
        }

        const description = document.getElementById('queryDescription').value;
        if (description == '') {
            window.pqy_notify.warn('Please enter description');
            document.getElementById('queryDescription').focus();
            return;
        }

        const telephone = document.getElementById('queryTelephone').value;
        if (telephone == '') {
            window.pqy_notify.warn('Please telephone');
            document.getElementById('queryTelephone').focus();
            return;
        }

        const email = document.getElementById('queryEmail').value;
        if (email == '') {
            window.pqy_notify.warn('Please enter email');
            document.getElementById('queryEmail').focus();
            return;
        }

        var website = document.getElementById('queryWebsite').value;
        if (website == '') {
            window.pqy_notify.warn('Please enter website');
            document.getElementById('queryWebsite').focus();
            return;
        }
        website = website.indexOf('://') === -1 ? 'http://' + website : website;

        const terms = document.getElementById('queryTerms').value;
        if (terms == '') {
            window.pqy_notify.warn('Please enter terms');
            document.getElementById('queryTerms').focus();
            return;
        }

        const type = document.getElementById('queryType').value;
        if (type == '') {
            window.pqy_notify.warn('Please enter type');
            document.getElementById('queryType').focus();
            return;
        }

        const label = document.getElementById('queryLabel').value;
        if (label == '') {
            window.pqy_notify.warn('Please enter label');
            document.getElementById('queryLabel').focus();
            return;
        }

        //const deadline = document.getElementById('queryDeadline').value;        //deadline is assigned from the script on the page itself
        if (deadline == '') {
            window.pqy_notify.warn('Please enter deadline');
            document.getElementById('queryDeadline').focus();
            return;
        }
        const reward =
            Number(document.getElementById('queryReward').value) || 0;

        if (reward == '') {
            window.pqy_notify.warn('Please enter reward in numeric form');
            document.getElementById('queryReward').focus();
            return;
        }
        const reward_form = document.getElementById('queryRewardForm').value;

        if (reward_form == '') {
            window.pqy_notify.warn('Please enter reward form');
            document.getElementById('queryRewardForm').focus();
            return;
        }
        const author = active_user;

        const category = 'peerquery';

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

        const body =
            $('<div />')
                .html(Editor.setup.getMarkdown())
                .find('span')
                .contents()
                .unwrap()
                .end()
                .end()
                .html() +
            config.query_attribution.replace(
                /URL/g,
                config.site_uri + '/query/' + permlink
            );
        if (body == '') {
            window.pqy_notify.warn('Please enter query body');
            return;
        }

        const tagString = document
            .getElementById('query-tags')
            .value.toLowerCase()
            .replace(/\W+/g, ' ');
        if (tagString == '') {
            window.pqy_notify.warn('Please enter atleast one tag');
            document.getElementById('query-tags').focus();
            return;
        }

        const tags = tagString.split(' ', 3);
        tags.unshift(category);

        if (title.length < 5) {
            window.pqy_notify.warn('Please enter a longer title!');
            return;
        }

        document.getElementById('form').className = 'ui loading form';

        $('#publish').addClass('disabled');
        do_publish(
            category,
            author,
            permlink,
            title,
            body,
            tags,
            project_slug_id,
            project_title,
            terms,
            email,
            telephone,
            website,
            reward,
            reward_form,
            label,
            type,
            deadline,
            image,
            description
        );
    }

    async function do_publish(
        category,
        author,
        permlink,
        title,
        body,
        tags,
        project_slug_id,
        project_title,
        terms,
        email,
        telephone,
        website,
        reward,
        reward_form,
        label,
        type,
        deadline,
        image,
        description
    ) {
        const access_token = await Promise.resolve(sessionStorage.access_token);

        if (!access_token || access_token == '') {
            window.pqy_notify.warn(
                'Sorry, no auth tokens. Please login and try again.'
            );
            window.location.href = '/login';
        }

        const steem_api = sc2.Initialize({
            app: config.sc2_app_name,
            callbackURL: window.location.href,
            accessToken: access_token,
            scope: config.sc2_scope_array,
        });

        steem_api.comment(
            '', // author, leave blank for new query
            category, // first tag
            author, // username
            permlink, // permlink
            title, // Title
            body, // Body of query
            { tags: tags, app: 'peerquery' }, // json metadata (additional tags, app name, etc)

            async function(err, results) {
                if (err) {
                    var err_description = JSON.stringify(err.error_description);
                    if (!err_description) {
                        console.log(err);
                        window.pqy_notify.warn(
                            'Sorry, something went wrong. Please try again'
                        );
                        return;
                    }

                    if (err_description.indexOf('The comment is archived') > -1)
                        return window.pqy_notify.warn(
                            'Post with the same permlink already exists and is archived, please change your permlink.'
                        );

                    if (
                        err_description.indexOf(
                            'You may only post once every'
                        ) > -1
                    )
                        return window.pqy_notify.warn(
                            'You may only post once every few seconds!'
                        );
                    //throw err;

                    window.pqy_notify.warn('Failure! ' + err_description);
                    document.getElementById('form').className = 'ui form';
                } else {
                    //console.log('Success!', results);
                    //now ping the server with update
                    try {
                        var data = {};
                        data.steemid = results.result.id;
                        //data.steemid = 6768679; //used during hurried dev testing
                        if (project_slug_id !== '')
                            data.project_slug_id = project_slug_id;
                        if (project_title !== '')
                            data.project_title = project_title;
                        data.title = title;
                        data.category = category;
                        data.body = body;
                        data.permlink = permlink;
                        data.terms = terms;
                        data.telephone = telephone;
                        data.email = email;
                        data.website = website;
                        data.reward = reward;
                        data.reward_form = reward_form;
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
                        var type = window.location.pathname.split('/')[2];
                        if (!type) type = 'comment';
                        window.localStorage.removeItem(type);

                        window.location.href = '/query/' + permlink;
                    } catch (err) {
                        console.log(err);
                        window.pqy_notify.warn(
                            'Sorry, an error occured updating the server. However, the query has been successfully published to your Steem account.'
                        );
                        window.location.href = '/query/' + permlink;
                    }
                }
            }
        );
    }

    (async function() {
        $.getJSON('/api/private/projects/list', null, function(data) {
            user_projects = data;
            //$("#projectSelect option").remove(); // Remove all <option> child tags.

            $('#projectField').removeClass('disabled');
            $.each(data, function(index, item) {
                // Iterates through a collection
                $('#projectSelect').append(
                    // Append an object to the inside of the select box
                    $('<option></option>') // Yes you can do this.
                        .text(item.name)
                        .val(item.slug)
                );
            });
        });
    })();

    $('.limitedText').on('keyup', function() {
        var maxLength = $(this).attr('maxlength');
        if (maxLength == $(this).val().length) {
            window.pqy_notify.warn(
                'You can\'t write more than ' + maxLength + ' characters'
            );
        }
    });
});
