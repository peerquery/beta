'use strict';

var sc2 = require('steemconnect'),
    Editor = require('../../lib/editor'),
    accounter = require('../../lib/helpers/account'),
    config = require('../../configs/config');

//jquery is already universal through the `scripts.js` global file

$(window).on('load', function() {
    var user_projects;

    //$('#account_img').attr("src", "https://steemitimages.com/u/" + active_user + "/avatar");

    //set up editor
    window.Editor = Editor;
    Editor.disable_image_upload();
    Editor.auto_save();

    $('#publish').on('click', function() {
        publish();
    });

    function publish() {
        //publish function goes here
        var project_title;

        const project_slug_id = $('#projectSelect')
            .find(':selected')
            .val();
        if (project_slug_id !== '') {
            //project_title = user_projects.filter( e => e.slug_id === project_slug_id )[0].title;
            project_title = user_projects.filter(
                e => e.slug_id === project_slug_id
            )[0];
            project_title = project_title.title || project_title.name;
        } else {
            project_title = '';
        }

        const title = document.getElementById('post-title').value;
        if (title == '') {
            pqy_notify.warn('Please enter title');
            document.getElementById('post-title').focus();
            return;
        }

        const author = active_user;
        const category = $('#reportCategory')
            .find(':selected')
            .val();
        const reward = $('#reportReward')
            .find(':selected')
            .val();

        const tlink = title
            .replace(/\W+/g, ' ')
            .replace(/\s+/g, '-')
            .replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '')
            .toLowerCase();
        const permlink =
            accounter.build(author) +
            '-' +
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
            config.report_attribution.replace(
                /URL/g,
                config.site_uri + '/report/' + permlink
            );
        if (body == '') {
            pqy_notify.warn('Please enter post body');
            return;
        }

        const tagString = document
            .getElementById('post-tags')
            .value.replace(/\W+/g, ' ')
            .toLowerCase();
        if (tagString == '') {
            pqy_notify.warn('Please enter atleast one tag');
            document.getElementById('post-tags').focus();
            return;
        }

        var tags = tagString.split(' ', 3);
        tags.unshift(category);

        if (title.length < 5) {
            pqy_notify.warn('Please enter a longer title!');
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
            reward,
            tags,
            project_slug_id,
            project_title
        );
    }

    async function do_publish(
        category,
        author,
        permlink,
        title,
        body,
        reward,
        tags,
        project_slug_id,
        project_title
    ) {
        const access_token = await Promise.resolve(sessionStorage.access_token);

        if (!active_user || active_user === '') {
            pqy_notify.warn('Sorry not logged in. Please login and try again.');
            window.location.href = '/login';
        }

        let steem_api = sc2.Initialize({
            app: config.sc2_app_name,
            callbackURL: window.location.href,
            accessToken: access_token,
            scope: config.sc2_scope_array,
        });

        var beneficiaries = await get_beneficiaries(category);
        beneficiaries = beneficiaries.filter(
            beneficiary => beneficiary.account != author
        );

        var operations = [
            [
                'comment',
                {
                    parent_author: '',
                    parent_permlink: category,
                    author: author,
                    permlink: permlink,
                    title: title,
                    body: body,
                    json_metadata: JSON.stringify({
                        tags: tags,
                        app: 'peerquery',
                    }),
                },
            ],
            [
                'comment_options',
                {
                    author: author,
                    permlink: permlink,
                    max_accepted_payout:
                        reward == '0' ? '0.000 SBD' : '1000000.000 SBD',
                    percent_steem_dollars: reward == '100' ? 0 : 10000,
                    allow_votes: true,
                    allow_curation_rewards: true,
                    extensions: [
                        [
                            0,
                            {
                                beneficiaries: beneficiaries,
                            },
                        ],
                    ],
                },
            ],
        ];

        steem_api.broadcast(operations, async function(err, results) {
            if (err) {
                var err_description = JSON.stringify(err.error_description);
                if (!err_description) {
                    console.log(err);
                    pqy_notify.warn(
                        'Sorry, something went wrong. Please try again'
                    );
                    return;
                }

                if (err_description.indexOf('The comment is archived') > -1)
                    return pqy_notify.warn(
                        'Post with the same permlink already exists and is archived, please change your permlink.'
                    );

                if (
                    err_description.indexOf('You may only post once every 5') >
                    -1
                )
                    return pqy_notify.warn(
                        'You may only post once every five minutes!'
                    );

                //throw err;
                pqy_notify.warn('Failure! ' + err);
                document.getElementById('form').className = 'ui form';
            } else {
                //console.log('Success!', results);
                //now ping the server with update
                try {
                    var data = {};
                    data.steemid = results.result.id;
                    if (project_slug_id !== '')
                        data.project_slug_id = project_slug_id;
                    if (project_title !== '')
                        data.project_title = project_title;
                    data.title = title;
                    data.category = category;
                    data.body = body;
                    data.permlink = permlink;
                    var status = await Promise.resolve(
                        $.post('/api/private/create/report', data)
                    );
                    //console.log(status);

                    //clear backup from localStorage
                    var content_type = window.location.pathname.split('/')[2];
                    if (!content_type) content_type = 'comment';
                    window.localStorage.removeItem(content_type);
                } catch (err) {
                    console.log(err);
                    pqy_notify.warn(
                        'Sorry, an error occured updating the server. However, the report has been successfully published to your Steem account.'
                    );
                    window.location.href = '/report/' + permlink;
                }
                window.location.href = '/report/' + permlink;
            }
        });
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

    async function get_beneficiaries(category) {
        let beneficiaries = [];

        if (category == 'utopian-io') {
            beneficiaries.push({ account: 'utopian.pay', weight: 500 });
            beneficiaries.push({ account: 'peerquery', weight: 500 });
        } else {
            beneficiaries.push({ account: 'peerquery', weight: 1000 });
        }

        if (!window.get_beneficiaries_agreed()) return beneficiaries;

        var results = await Promise.resolve(
            $.get('/api/private/beneficiaries/list')
        );

        var beneficiaries_list = results.peers.concat(results.projects);

        var beneficiaries_list_count = beneficiaries_list.length;
        var total_beneficiaries_percent = beneficiaries_list.reduce(
            (prev, cur) => prev + cur.benefactor_rate,
            0
        );

        if (!beneficiaries_list_count || !total_beneficiaries_percent)
            return beneficiaries;
        if (total_beneficiaries_percent > 90 || beneficiaries_list_count > 90)
            return beneficiaries;

        var user_beneficiaries = await Promise.all(
            beneficiaries_list.map(async beneficiary => {
                if (beneficiary.following || beneficiary.steem)
                    return {
                        account: beneficiary.following || beneficiary.steem,
                        weight: beneficiary.benefactor_rate * 100,
                    };
            })
        );

        return merge_sum_duplicates(beneficiaries.concat(user_beneficiaries));
    }

    function merge_sum_duplicates(data) {
        var o = {};

        data.forEach(i => {
            var account = i.account;
            i.weight = parseInt(i.weight);
            if (!o[account]) {
                return (o[account] = i);
            }
            return (o[account].weight = o[account].weight + i.weight);
        });
        //console.log(o)

        var new_data = [];
        Object.keys(o).forEach(key => {
            new_data.push(o[key]);
        });

        //console.log(new_data)

        return new_data;
    }
});
