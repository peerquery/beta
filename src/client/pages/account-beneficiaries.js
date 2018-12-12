'use strict';

const timeago = require('timeago.js');
const timeagoInstance = timeago();

$(document).ready(function() {
    (function load_beneficiary() {
        $.get('/api/private/beneficiaries/', function(data, status) {
            if (status == 'success') {
                $('#spinner').hide();
                $('#add').show();

                if (data.projects.length == 0 && data.peers.length == 0) {
                    pqy_notify.warn('Sorry, nothing found.');
                } else {
                    for (let x in data.projects) {
                        data.projects[x].title =
                            '<i class="coffee icon"></i> <a href="/project/' +
                            data.projects[x].slug_id +
                            '" target="_blank" >' +
                            data.projects[x].title +
                            '</a>';
                        data.projects[x].target = data.projects[x].slug_id;
                        data.projects[x].type = 'project';
                        add_row(data.projects[x]);
                    }
                    for (let x in data.peers) {
                        data.peers[x].title =
                            '<i class="user icon"></i> <a href="/peer/' +
                            data.peers[x].following +
                            '" target="_blank" >@' +
                            data.peers[x].following +
                            '</a>';
                        data.peers[x].target = data.peers[x].following;
                        data.peers[x].type = 'user';
                        add_row(data.peers[x]);
                    }
                }
            } else {
                pqy_notify.warn('Err fetching results, please try again');
            }
        });
    })();

    function add_row(data) {
        var table = document.getElementById('beneficiaries_list');

        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        cell1.innerHTML = data.title;
        cell1.setAttribute('data-target', data.target);
        cell1.setAttribute('data-type', data.type);
        cell1.setAttribute('data-rate', data.benefactor_rate);
        cell2.innerHTML = data.benefactor_rate;
        cell3.innerHTML = data.benefactor_label;
        cell4.innerHTML = timeagoInstance.format(data.benefactor_created);
        if (data.benefactor_message && data.benefactor_message !== '') {
            cell5.innerHTML = '<i class="info circle icon"></i>';
            cell5.setAttribute('data-tooltip', data.benefactor_message);
            cell5.setAttribute('data-position', 'top right');
        } else {
            cell5.innerHTML = '';
        }
        cell6.innerHTML =
            '<botton class=\'circular ui icon mini remove button\'>  <i class=\'icon user times\'></i>  </button>';
    }

    function add_beneficiary() {
        var target = $('#target')
            .val()
            .replace(/@/g, '');
        var type = $('#type').val();
        var rate = $('#rate').val();
        if (Number(rate) > 90) {
            pqy_notify.warn('Sorry, you cannot exceed 90%');
            return;
        }
        if (Number(rate) > window.available_rate) {
            pqy_notify.warn('Sorry you cannot exceed the availabler rate');
            return;
        }
        var label = $('#label').val();
        var message = $('#message').val();

        if (target == '') $('#target_field').addClass('error');
        else if (type == '') $('#type_field').addClass('error');
        else if (rate == '') $('#rate_field').addClass('error');
        else if (label == '') $('#label_field').addClass('error');
        else if (message == '') $('#message_field').addClass('error');
        else {
            $('#target_field').removeClass('error');
            $('#type_field').removeClass('error');
            $('#rate_field').removeClass('error');
            $('#label_field').removeClass('error');
            $('#message_field').removeClass('error');

            $('#form').addClass('loading');
            $('.form_inputs').addClass('disabled');
            $('.form .ui.dropdown').addClass('disabled');

            window.beneficiaries_percentage =
                window.beneficiaries_percentage + Number(rate);
            window.beneficiaries_count = window.beneficiaries_count + 1;
            window.available_rate = 100 - window.beneficiaries_percentage;

            $('#rateLabel').text(
                'Rate in %[Upto ' + window.available_rate + ']'
            );
            $('#beneficiaries_stats').text(
                window.beneficiaries_count +
                    ' Beneficiaries | Receiving ' +
                    window.beneficiaries_percentage +
                    '%'
            );

            if (window.available_rate == 0) {
                $('#add').addClass('disabled');
                pqy_notify.warn(
                    'You have consumed 100% of your reward pool. Please remove some of the existing ones to free up rates for new ones.'
                );
            }

            if (window.available_rate < 0) {
                pqy_notify.warn(
                    'Sorry, you have consumed 100% of your reward pool. Please remove some of the existing ones to free up rates for new ones.'
                );
                return;
            }

            $.post(
                '/api/private/beneficiary/add',
                {
                    target: target,
                    message: message,
                    type: type,
                    label: label,
                    rate: rate,
                },
                function(response, status) {
                    $('#form').removeClass('loading');
                    if (status === 'success') {
                        $('#form').addClass('success');

                        //add list beneficiary member in real-time
                        let data = {};
                        if (type == 'project')
                            data.title =
                                '<i class="coffee icon"></i> <a href="/project/' +
                                target +
                                '" target="_blank" >' +
                                target +
                                '</a>';
                        if (type == 'peer')
                            data.title =
                                '<i class="user icon"></i> <a href="/peer/' +
                                target +
                                '" target="_blank" >@' +
                                target +
                                '</a>';
                        data.target = target;
                        data.type = type;
                        data.benefactor_label = label;
                        data.benefactor_message = message;
                        data.benefactor_rate = rate;
                        data.created = new Date();
                        if (type == 'project')
                            data.title =
                                '<i class="coffee icon"></i> <a href="/project/' +
                                target +
                                '" target="_blank" >' +
                                target +
                                '</a>';
                        if (type == 'peer')
                            data.title =
                                '<i class="user icon"></i> <a href="/peer/' +
                                target +
                                '" target="_blank" >' +
                                target +
                                '</a>';

                        add_row(data);
                        pqy_notify.success('Successully set new beneficiary');
                    } else {
                        $('#form').addClass('error');
                    }
                }
            ).fail(function(data, textStatus, xhr) {
                if (data.status == 405) {
                    pqy_notify.warn('Sorry, target not found');
                    return;
                }

                pqy_notify.warn('Sorry, an error occured');
            });
        }
    }

    function remove_beneficiary() {
        $('#remove_beneficiary').addClass('disabled');

        var table = document.getElementById('beneficiaries_list');

        var delete_beneficiary_target =
            table.rows[window.active_table_index].cells[0].dataset.target;

        var delete_beneficiary_type =
            table.rows[window.active_table_index].cells[0].dataset.type;

        var delete_beneficiary_rate =
            table.rows[window.active_table_index].cells[0].dataset.rate;

        window.beneficiaries_percentage =
            window.beneficiaries_percentage - Number(delete_beneficiary_rate);
        window.beneficiaries_count = window.beneficiaries_count - 1;
        window.available_rate = 100 - window.beneficiaries_percentage;

        $('#rateLabel').text('Rate in %[Upto ' + window.available_rate + ']');
        $('#beneficiaries_stats').text(
            window.beneficiaries_count +
                ' Beneficiaries | Receiving ' +
                window.beneficiaries_percentage +
                '%'
        );

        if (window.available_rate > 0) $('#add').removeClass('disabled');

        $.post(
            '/api/private/beneficiary/remove',
            {
                target: delete_beneficiary_target,
                type: delete_beneficiary_type,
            },
            function(data, status) {
                //console.log(data, status)

                if (status === 'success') {
                    window.close_remove_modal();

                    document
                        .getElementById('beneficiaries_list')
                        .deleteRow(window.active_table_index);
                } else {
                    pqy_notify.warn(
                        'Sorry, there was an error. Pease try again.'
                    );
                    $('.ui.basic.modal')
                        .modal({
                            onHide: function() {
                                $('#remove_beneficiary').removeClass(
                                    'disabled'
                                );
                            },
                        })
                        .modal('hide');
                }
            }
        );
    }

    function clear_table() {
        var tableHeaderRowCount = 1;
        var table = document.getElementById('beneficiaries_list');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }
    }

    //set up click event listeners

    $('#add_beneficiary').click(function() {
        add_beneficiary();
    });

    $('#remove_beneficiary').click(function() {
        remove_beneficiary();
    });
});
