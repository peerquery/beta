'use strict';

const timeago = require('timeago.js');
const timeagoInstance = timeago();

$(document).ready(function() {
    var action = '';
    var index = 0;
    var team_type = '';

    function load_team(type) {
        team_type = type;

        $('#message').html('');
        clear_table();
        $('#team_list_segment').addClass('loading');

        $.get('/api/private/office/team/' + type, function(data, status) {
            if (status == 'success') {
                $('#team_list_segment').removeClass('loading');

                if (data.length == 0) {
                    $('#message').html(
                        '<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>'
                    );
                } else {
                    for (let x in data) {
                        add_row(data[x]);
                    }
                }
            } else {
                pqy_notify.warn('Err fetching results, please try again');
            }
        });
    }

    function add_row(data) {
        var table = document.getElementById('team_list');

        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        cell1.innerHTML = '@' + data.account;
        cell2.innerHTML = data.email;
        cell3.innerHTML = timeagoInstance.format(data.created);
        cell4.innerHTML = data.status;
        cell5.innerHTML = data.label;
        if (team_type == 'inactive') {
            cell6.innerHTML = '';
        } else {
            cell6.innerHTML =
                '<botton class=\'circular ui icon mini remove button\'>  <i class=\'icon user times\'></i>  </button>';
        }
    }

    function add_team() {
        $('#message').html('');

        var new_team_account = $('#new_team_account').val();
        var new_team_email = $('#new_team_email').val();
        var new_team_role = $('#new_team_role').val();
        var new_team_label = $('#new_team_label').val();
        var new_team_about = $('#new_team_about').val();

        if (new_team_account == '')
            $('#new_team_account_field').addClass('error');
        else if (new_team_email == '')
            $('#new_team_email_field').addClass('error');
        else if (new_team_role == '')
            $('#new_team_role_field').addClass('error');
        else if (new_team_label == '')
            $('#new_team_label_field').addClass('error');
        else if (new_team_about == '')
            $('#new_team_about_field').addClass('error');
        else {
            $('#new_team_account_field').removeClass('error');
            $('#new_team_email_field').removeClass('error');
            $('#new_team_role_field').removeClass('error');
            $('#new_team_label_field').removeClass('error');
            $('#new_team_about_field').removeClass('error');

            $('#new_team_form').addClass('loading');
            $('.form_inputs').addClass('disabled');
            $('.form .ui.dropdown').addClass('disabled');

            $.post(
                '/api/private/office/team/add',
                {
                    account: new_team_account,
                    email: new_team_email,
                    role: new_team_role,
                    label: new_team_label,
                    about: new_team_about,
                },
                function(response, status) {
                    $('#new_team_form').removeClass('loading');
                    if (status === 'success') {
                        $('#new_team_form').addClass('success');

                        //add list team member in real-time
                        let data = {};
                        data.account = new_team_account;
                        data.email = new_team_email;
                        data.created = new Date();
                        data.label = new_team_label;
                        data.status = 'core';

                        add_row(data);
                    } else {
                        $('#new_team_form').addClass('error');
                    }
                }
            ).fail(function(data, textStatus, xhr) {
                if (data.status == 405)
                    pqy_notify.warn('Sorry, account not found');
            });
        }
    }

    function remove_team() {
        $('#remove_btn').addClass('disabled');

        var table = document.getElementById('team_list');

        var delete_team_account = table.rows[
            index
        ].cells[0].innerHTML.substring(1);

        $.post(
            '/api/private/office/team/remove',
            {
                account: delete_team_account,
            },
            function(data, status) {
                if (status === 'success') {
                    window.close_remove_modal();

                    document.getElementById('team_list').deleteRow(index);
                } else {
                    pqy_notify.warn(
                        'Sorry, there was an error. Pease try again.'
                    );
                    $('.ui.basic.modal')
                        .modal({
                            onHide: function() {
                                $('#remove_btn').removeClass('disabled');
                            },
                        })
                        .modal('hide');
                }
            }
        );
    }

    load_team('admin');

    function clear_table() {
        var tableHeaderRowCount = 1;
        var table = document.getElementById('team_list');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }
    }

    //set up click event listeners

    $('#team_admins').click(function() {
        load_team('admin');
    });

    $('#team_mods').click(function() {
        load_team('moderator');
    });

    $('#team_curies').click(function() {
        load_team('curator');
    });

    $('#team_core').click(function() {
        load_team('core');
    });

    $('#team_inactive').click(function() {
        load_team('inactive');
    });

    //
    $('#add_team').click(function() {
        add_team();
    });

    $('#remove_team').click(function() {
        remove_team();
    });
});
