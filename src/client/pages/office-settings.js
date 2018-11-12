'use strict';

var original_value1 = document.getElementById('settings-table').rows[2].cells[1]
    .innerText;
var original_value2 = document.getElementById('settings-table').rows[3].cells[1]
    .innerText;
var original_value3 = document.getElementById('settings-table').rows[4].cells[1]
    .innerText;
var original_value4 = document.getElementById('settings-table').rows[5].cells[1]
    .innerText;
var original_value5 = document.getElementById('settings-table').rows[6].cells[1]
    .innerText;
var original_value6 = document.getElementById('settings-table').rows[8].cells[1]
    .innerText;
var original_value7 = document.getElementById('settings-table').rows[9].cells[1]
    .innerText;
var original_value8 = document.getElementById('settings-table').rows[10]
    .cells[1].innerText;
var original_value9 = document.getElementById('settings-table').rows[11]
    .cells[1].innerText;

function original_value(i) {
    if (i == 2) return original_value1;
    if (i == 3) return original_value2;
    if (i == 4) return original_value3;
    if (i == 5) return original_value4;
    if (i == 6) return original_value5;
    if (i == 8) return original_value6;
    if (i == 9) return original_value7;
    if (i == 10) return original_value8;
    if (i == 11) return original_value9;
}

function settings_api(i) {
    if (i == 2) return 'curation_community_rate';
    if (i == 3) return 'curation_team_rate';
    if (i == 4) return 'curation_project_rate';
    if (i == 5) return 'curation_curator_rate';
    if (i == 6) return 'curation_common_comment';
    if (i == 8) return 'curation_rest_day1';
    if (i == 9) return 'curation_rest_day2';
    if (i == 10) return 'curation_daily_limit';
    if (i == 11) return 'curation_vote_interval_minutes';
}

function set_new_value(i, value) {
    if (i == 2) original_value1 = value;
    if (i == 3) original_value2 = value;
    if (i == 4) original_value3 = value;
    if (i == 5) original_value4 = value;
    if (i == 6) original_value5 = value;
    if (i == 8) original_value6 = value;
    if (i == 9) original_value7 = value;
    if (i == 10) original_value8 = value;
    if (i == 11) original_value9 = value;
}

function post(i) {
    var update = {};
    update.data = document.getElementById('settings-table').rows[
        i
    ].cells[1].innerText;
    update.setting = settings_api(i);

    $.post('/api/private/office/settings/update', update, function(
        data,
        status
    ) {
        document.getElementById('settings-table').rows[i].cells[1].innerText =
            update.data;

        set_new_value(i, update.data);

        document.getElementById('settings-table').rows[
            i
        ].cells[1].style.backgroundColor = '#fff';
        document
            .getElementById('settings-table')
            .rows[i].cells[1].setAttribute('contenteditable', 'false');
        document.getElementById('settings-table').rows[i].cells[2].className =
            '';
        $('#' + i + 'edit').html('<i class="id edit icon"></i> Edit');
    }).fail(function(err) {
        pqy_notify.warn('An error occurred, pleased try again.');
        //console.log(err.statusText);
        document.getElementById('settings-table').rows[
            i
        ].cells[1].innerText = original_value(i);
        document.getElementById('settings-table').rows[
            i
        ].cells[1].style.backgroundColor = '#fff';
        document
            .getElementById('settings-table')
            .rows[i].cells[1].setAttribute('contenteditable', 'false');
        document.getElementById('settings-table').rows[i].cells[2].className =
            '';
        $('#' + i + 'edit').html('<i class="id edit icon"></i> Edit');
    });
}

$('.edit').click(function() {
    //console.log(this);
    var el = this.parentNode.parentNode;

    $('#' + el.rowIndex + 'edit').hide();

    //console.log(el.cells[1])
    document.getElementById('settings-table').rows[
        el.rowIndex
    ].cells[1].style.backgroundColor = '#f8f8f9';
    document
        .getElementById('settings-table')
        .rows[el.rowIndex].cells[1].setAttribute('contenteditable', 'true');
    document
        .getElementById('settings-table')
        .rows[el.rowIndex].cells[1].focus();

    $('#' + el.rowIndex + 'save').show();
    $('#' + el.rowIndex + 'cancel').show();
}); //

$('.save').click(function() {
    //console.log(this);
    var el = this.parentNode.parentNode;

    $('#' + el.rowIndex + 'save').hide();
    $('#' + el.rowIndex + 'cancel').hide();

    $('#' + el.rowIndex + 'edit').show();
    $('#' + el.rowIndex + 'edit').html('Please wait...');

    //console.log(el.cells[1])
    document.getElementById('settings-table').rows[
        el.rowIndex
    ].cells[1].style.backgroundColor = '#ffa';
    document
        .getElementById('settings-table')
        .rows[el.rowIndex].cells[1].setAttribute('contenteditable', 'false');
    document.getElementById('settings-table').rows[
        el.rowIndex
    ].cells[2].className = 'disabled';

    post(el.rowIndex);
});

$('.cancel').click(function() {
    //console.log(this);
    var el = this.parentNode.parentNode;

    $('#' + el.rowIndex + 'edit').show();

    //console.log(el.cells[1])
    document.getElementById('settings-table').rows[
        el.rowIndex
    ].cells[1].innerText = original_value(el.rowIndex);
    document.getElementById('settings-table').rows[
        el.rowIndex
    ].cells[1].style.backgroundColor = '#fff';
    document
        .getElementById('settings-table')
        .rows[el.rowIndex].cells[1].setAttribute('contenteditable', 'false');

    $('#' + el.rowIndex + 'save').hide();
    $('#' + el.rowIndex + 'cancel').hide();
});

$('#reset_click').click(function() {
    $(this).addClass('disabled');
    $('#cancel_click').addClass('disabled');

    $.post('/api/private/office/settings/reset', {}, function(data, status) {
        pqy_notify.success('Reset was successful');
        window.location.reload();
    }).fail(function(err) {
        pqy_notify.warn(err.statusText);
        console.log(err.statusText);
    });
});
