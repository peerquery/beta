'use strict';

var Editor = require('../../lib/editor'),
    config = require('../../configs/config');

//jquery is already universal through the `ui.js` global file

$(window).on('load', function() {
    //set up editor
    window.Editor = Editor;
    Editor.disable_image_upload();
    Editor.auto_save();
});

//$('#account_img').attr("src", "https://steemitimages.com/u/" + active_user + "/avatar");

$('#createBtn').on('click', function() {
    if (validateForm() == true) {
        post();
        $('form').addClass('loading');
        $('#' + this.id).addClass('disabled');
    }
});

var data = {};

function validateForm() {
    data.name = $('#projectName').val();
    data.steem = $('#projectSteem').val();
    //data.founder = active_user; //handled server side for thorough consistency
    data.description = $('#projectDescription')
        .val()
        .substring(0, 160);
    data.title = $('#projectTitle')
        .val()
        .substring(0, 100);

    data.type = $('#projectType')
        .find(':selected')
        .val();

    data.story = $('<div />')
        .html(Editor.setup.getMarkdown())
        .find('span')
        .contents()
        .unwrap()
        .end()
        .end()
        .html();
    data.tag = $('#projectTag').val();

    var required = [
        data.name,
        data.steem,
        data.description,
        data.title,
        data.type,
    ];
    var empty = '';
    var invalid = required.indexOf(empty);

    if (invalid > -1) {
        var name = '';
        var id = '';
        var field = '';

        if (invalid == 0) {
            name = 'Name field';
            (id = 'projectName'), (field = 'nameField');
        }
        if (invalid == 1) {
            name = 'Steem field';
            (id = 'projectSteem'), (field = 'steemField');
        }
        if (invalid == 2) {
            name = 'Description field';
            (id = 'projectDescription'), (field = 'descriptionField');
        }
        if (invalid == 3) {
            name = 'Title field';
            (id = 'projectTitle'), (field = 'titleField');
        }
        if (invalid == 4) {
            name = 'Type field';
            (id = 'projectType'), (field = 'typeField');
        }

        pqy_notify.warn(name + ' cannot be empty');
        $('#' + id).focus();
        $('#' + field).addClass('error');

        return false;
    } else {
        if (data.story.length / Math.pow(1024, 1) > 10) {
            //greater than 10kb
            pqy_notify.warn('Story size cannot be more than 10kb.');
            $('#projectStory').focus();
            $('#storyField').addClass('error');
            return;
        } else if (data.story == '') {
            //cannot enter empty body
            pqy_notify.warn('Please enter story of your project.');
            return false;
        } else {
            return true;
        }
    }
}

async function post() {
    try {
        var status = await Promise.resolve(
            $.post('/api/private/create/project', data)
        );
        //console.log(status);

        //clear backup from localStorage
        var content_type = window.location.pathname.split('/')[2];
        if (!content_type) content_type = 'comment';
        window.localStorage.removeItem(content_type);

        window.location.href = '/project/' + status;
    } catch (err) {
        console.log(err);
        pqy_notify.warn('Sorry, an error occured. Please again');

        $('form').removeClass('loading');
        $('#createBtn').removeClass('disabled');
    }
}

$('.limitedText').on('keyup', function() {
    var maxLength = $(this).attr('maxlength');
    if (maxLength == $(this).val().length) {
        pqy_notify.warn(
            'You can\'t write more than ' + maxLength + ' characters'
        );
    }
});
