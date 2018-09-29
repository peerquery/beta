'use strict';

//toast ui editor styles
require('codemirror/lib/codemirror.css'); // codemirror
require('tui-editor/dist/tui-editor.css'); // editor ui
require('tui-editor/dist/tui-editor-contents.css'); // editor content
require('highlight.js/styles/github.css'); // code block highlight

var Editor = require('tui-editor');
//jquery is already universal through the `scripts.js` global file

module.exports = {
    setup: new Editor({
        el: document.querySelector('#editor'),
        initialEditType: 'wysiwyg',
        //initialValue: '',
        previewStyle: 'tab',
        height: '400px',
        /*
        events: {
            change: function() {
                console.log(editor.getMarkdown())
            },
        },
        */
        hooks: {
            addImageBlobHook: function(blob, callback) {
                /*
                var uploadedImageURL = imageUploadFunction(blob);
                callback(uploadedImageURL, 'alt text');
            */
                return false;
            },
        },
    }),

    disable_image_upload: function() {
        $('#editor').on('click', '.tui-image', function() {
            $('.te-file-type').removeClass('te-tab-active');
            $('.te-url-type').addClass('te-tab-active');

            $('.te-tab button[data-index=\'0\']')
                .attr('disabled', 'disabled')
                .removeClass('te-tab-active');
            $('.te-tab button[data-index=\'1\']').addClass('te-tab-active');
        });
    },

    backup: function() {
        var content_type = window.location.pathname.split('/')[2];
        if (!content_type) content_type = 'comment';

        let data = window
            .$('<div />')
            .html(window.Editor.setup.getMarkdown())
            .find('span')
            .contents()
            .unwrap()
            .end()
            .end()
            .html();

        //localStorage.setItem(content_type, this.setup.getValue());//calling setup directly doesn't work
        localStorage.setItem(content_type, data);
    },

    auto_save: function() {
        var content_type = window.location.pathname.split('/')[2];
        if (!content_type) content_type = 'comment';

        //check if saved post exists
        var post = localStorage.getItem(content_type);

        let editor = window.Editor.setup;

        if (post && post !== '') {
            editor.setMarkdown(post);
            pqy_notify.success(
                'Existing ' + content_type + ' restored to editor'
            );
        }

        //setInterval(this.backup, 1 * 60 * 1000, data);//if we had real-time dynamic input of data. currently attempting this does not produce real-time data
        setInterval(this.backup, 1 * 60 * 1000); //every 1 minute
        pqy_notify.inform(
            'Saving the <em>editor content</em> for your ' +
                content_type +
                ' locally every 1 minute'
        );
    },
};
