'use strict';

const markup = require('markup-builder');
const rate_name = require('../../lib/helpers/curation-rate-name');
const create_list = require('../../lib/creators/curating-list');
const timeago = require('timeago.js');
const timeagoInstance = timeago();

$(document).ready(function() {
    var post_obj = {};
    var modal_mode = '';

    function curate() {
        $('#post_meta').hide();
        $('#post_actions').hide();
        $('#load_button_div').html('');

        $('#curate_segment').addClass('loading');

        $.get('/api/private/office/curation/curate', async function(
            data,
            status
        ) {
            //console.log(data);

            if (!data) {
                $('#curate_segment').removeClass('loading');
                $('#load_button_div').html(
                    '<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>'
                );
            } else {
                post_obj = data;

                $('#curation_percent').text(post_obj.percent);
                $('#post_author').text('@' + post_obj.author);
                $('#post_author').attr('href', '/peer/' + post_obj.author);
                $('#full_post_view').attr(
                    'href',
                    '/report/' + post_obj.permlink
                );
                $('#post_title').html(post_obj.title);
                $('#post_author_img').attr(
                    'src',
                    'https://steemitimages.com/u/' + post_obj.author + '/avatar'
                );

                $('#post_time').text(timeagoInstance.format(post_obj.created));
                $('#post_time').attr('title', new Date(post_obj.created));

                $('#post_body').html(await markup.build.content(post_obj.body));

                $('#post_meta').show();
                $('#post_actions').show();

                $('#curate_segment').removeClass('loading');
            }
        }).fail(function(data, textStatus, xhr) {
            $('#curate_segment').removeClass('loading');

            if (data.status == 404)
                return pqy_notify.warn('Sorry, nothing to curate yet');

            pqy_notify.warn(data.responseText);
        });
    }

    function curating() {
        $('#post_list_segment').hide();
        $('#start_curate').hide();

        $('#remarks').val('');

        $('.form_inputs').attr('disabled', false);
        $('.ui.dropdown').removeClass('disabled');

        $('#curator_form').attr('class', 'ui curators form');

        $('#remarks_field').attr('class', 'field');

        $('#curate_segment').show();

        curate();
    }

    function approve() {
        var curation_remarks = $('#remarks').val();
        var curation_rate = $('#rate option:selected').val();

        if (curation_remarks.length > 100) {
            $('#remarks_field').attr('class', 'field');

            $('#curator_form').addClass('loading');

            $.post(
                '/api/private/office/curation/approve',
                {
                    _id: post_obj._id,
                    author: post_obj.author,
                    title: post_obj.title,
                    permlink: post_obj.permlink,
                    remarks: curation_remarks,
                    action: 'approve',
                    rate: curation_rate,
                },
                function(data, status) {
                    $('#curator_form').removeClass('loading');
                    $('.form_inputs').attr('disabled', true);
                    $('.options .ui.dropdown').addClass('disabled');
                    window.reset_rate_dropdown();
                    $('#curator_form').addClass('success');
                }
            ).fail(function() {
                $('#curator_form').addClass('error');
            });
        } else {
            $('#remarks_field').addClass('error');
            pqy_notify.warn('Please enter remark of aleast 100 charactors');
        }
    }

    function reject() {
        var curation_remarks = $('#remarks').val();

        if (curation_remarks.length > 100) {
            $('#remarks_field').attr('class', 'field');

            $('#curator_form').addClass('loading');

            $.post(
                '/api/private/office/curation/reject',
                {
                    _id: post_obj._id,
                    author: post_obj.author,
                    title: post_obj.title,
                    permlink: post_obj.permlink,
                    remarks: curation_remarks,
                    action: 'reject',
                },
                function(data, status) {
                    $('#curator_form').removeClass('loading');
                    $('.form_inputs').attr('disabled', true);
                    $('.ui.dropdown').addClass('disabled');
                    $('#curator_form').addClass('success');
                    window.reset_rate_dropdown();
                }
            ).fail(function() {
                $('#curator_form').addClass('error');
            });
        } else {
            $('#remarks_field').addClass('error');
            pqy_notify.warn('Please enter remark of aleast 100 charactors');
        }
    }

    function approved() {
        modal_mode = 'approved';
        $('#curate_segment').hide();
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');

        $.get('/api/private/office/curation/approved', function(data, status) {
            $('#post_list_segment').removeClass('loading');

            if (data.length == 0) {
                $('#post_list').html(
                    '<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>'
                );
            } else {
                for (let x in data) {
                    data[x].curation_rate_name = rate_name(
                        data[x].curation_rate
                    );
                    $('#post_list').append(create_list(data[x], modal_mode));
                }
            }
        }).fail(function() {
            pqy_notify.warn('Err fetching results, please try again');
        });
    }

    function ignored() {
        modal_mode = 'ignored';
        $('#curate_segment').hide();
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');

        $.get('/api/private/office/curation/ignored', function(data, status) {
            $('#post_list_segment').removeClass('loading');

            if (data.length == 0) {
                $('#post_list').html(
                    '<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>'
                );
            } else {
                for (let x in data) {
                    data[x].curation_rate_name = rate_name(
                        data[x].curation_rate
                    );
                    $('#post_list').append(create_list(data[x], modal_mode));
                }
            }
        }).fail(function() {
            pqy_notify.warn('Err fetching results, please try again');
        });
    }

    function lost() {
        modal_mode = 'lost';
        $('#curate_segment').hide();
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');

        $.get('/api/private/office/curation/lost', function(data, status) {
            $('#post_list_segment').removeClass('loading');

            if (data.length == 0) {
                $('#post_list').html(
                    '<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>'
                );
            } else {
                for (let x in data) {
                    data[x].curation_rate_name = rate_name(
                        data[x].curation_rate
                    );
                    $('#post_list').append(create_list(data[x], modal_mode));
                }
            }
        }).fail(function() {
            pqy_notify.warn('Err fetching results, please try again');
        });
    }

    function rejected() {
        modal_mode = 'rejected';
        $('#curate_segment').hide();
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');

        $.get('/api/private/office/curation/rejected', function(data, status) {
            $('#post_list_segment').removeClass('loading');

            if (data.length == 0) {
                $('#post_list').html(
                    '<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>'
                );
            } else {
                for (let x in data) {
                    data[x].curation_rate_name = rate_name(
                        data[x].curation_rate
                    );
                    $('#post_list').append(create_list(data[x], modal_mode));
                }
            }
        }).fail(function() {
            pqy_notify.warn('Err fetching results, please try again');
        });
    }

    async function show_post(dataset) {
        if (modal_mode == 'approved') {
            $('#modal-approve-btn').hide();
            $('#modal-reject-btn').show();

            dataset.html_body = await markup.build.content(dataset.body);
            dataset.curation_rate_name = rate_name(dataset.rate);

            window.show_modal(dataset);
        } else if (modal_mode == 'ignored') {
            $('#modal-approve-btn').show();
            $('#modal-reject-btn').show();

            dataset.html_body = await markup.build.content(dataset.body);
            dataset.curation_rate_name = rate_name(dataset.rate);

            window.show_modal(dataset);
        } else if (modal_mode == 'lost') {
            $('#modal-approve-btn').show();
            $('#modal-reject-btn').show();

            dataset.html_body = await markup.build.content(dataset.body);
            dataset.curation_rate_name = rate_name(dataset.rate);

            window.show_modal(dataset);
        } else if (modal_mode == 'rejected') {
            $('#modal-approve-btn').show();
            $('#modal-reject-btn').hide();

            dataset.html_body = await markup.build.content(dataset.body);
            dataset.curation_rate_name = rate_name(dataset.rate);

            window.show_modal(dataset);
        }
    }

    function modal_approve() {
        var curation_rate = $('#modal-rate option:selected').val();
        var curation_remarks = $('#approve-modal-remarks').val();

        if (curation_remarks.length > 100) {
            $('#approve-modal-remarks-field').attr('class', 'field');

            $('#modal-approve-form').addClass('loading');

            $('.ui.dropdown').addClass('disabled');

            $('#modal-approve').addClass('disabled');

            $.post(
                '/api/private/office/curation/approve',
                {
                    _id: post_obj._id,
                    author: post_obj.author,
                    title: post_obj.title,
                    permlink: post_obj.permlink,
                    remarks: curation_remarks,
                    action: 're-approve',
                    rate: curation_rate,
                },
                function(data, status) {
                    $('#modal-approve-form').removeClass('loading');
                    $('#approve-modal-remarks').attr('disabled', true);

                    $('#modal-approve-form').addClass('success');
                    $('#' + post_obj._id).remove();

                    $('#modal-rate').dropdown('set selected', '3');
                }
            ).fail(function() {
                $('#modal-approve-form').addClass('error');
            });
        } else {
            $('#approve-modal-remarks-field').addClass('error');
            pqy_notify.warn('Please enter remark of aleast 100 charactors');
        }
    }

    function modal_reject() {
        var curation_remarks = $('#reject-modal-remarks').val();

        if (curation_remarks.length > 100) {
            $('#reject-modal-remarks-field').attr('class', 'field');

            $('#modal-reject-form').addClass('loading');

            $('#modal-reject').addClass('disabled');

            $.post(
                '/api/private/office/curation/reject',
                {
                    _id: post_obj._id,
                    author: post_obj.author,
                    title: post_obj.title,
                    permlink: post_obj.permlink,
                    remarks: curation_remarks,
                    action: 're-reject',
                },
                function(data, status) {
                    $('#modal-reject-form').removeClass('loading');
                    $('#reject-modal-remarks').attr('disabled', true);

                    $('#modal-reject-form').addClass('success');
                    $('#' + post_obj._id).remove();

                    $('#modal-rate').dropdown('set selected', '3');
                }
            ).fail(function() {
                $('#modal-reject-form').addClass('error');
            });
        } else {
            $('#reject-modal-remarks-field').addClass('error');
            pqy_notify.warn('Please enter remark of aleast 100 charactors');
        }
    }

    //set up click listeners

    $('#post_list').on('click', '.view-post', function() {
        var dataset = this.dataset;
        post_obj = dataset;

        show_post(dataset);
    });

    //curating menu
    $('#curating').click(function() {
        curating();
    });

    $('#approved').click(function() {
        approved();
    });

    $('#ignored').click(function() {
        ignored();
    });

    $('#lost').click(function() {
        lost();
    });

    $('#rejected').click(function() {
        rejected();
    });

    //curator options
    $('#approve').click(function() {
        approve();
    });

    $('#reject').click(function() {
        reject();
    });

    $('#next').click(function() {
        curating();
    });

    //modal options
    $('#modal-approve').click(function() {
        //modal-approve();
        approve();
    });

    $('#modal-reject').click(function() {
        //modal - reject();
        reject();
    });

    //initial curate button
    $('#curate').click(function() {
        this.remove();
        curate();
    });
});
