
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
            addImageBlobHook: function (blob, callback) {
            /*
                var uploadedImageURL = imageUploadFunction(blob);
                callback(uploadedImageURL, 'alt text');
            */
                return false;
            },  
        }        
        
    }),
    
    disable_image_upload: function() {
        
        $('#editor').on('click', '.tui-image', function() {
                
            $('.te-file-type').removeClass('te-tab-active');
            $('.te-url-type').addClass('te-tab-active');
            
            
            $('.te-tab button[data-index=\'0\']').attr('disabled', 'disabled').removeClass('te-tab-active');
            $('.te-tab button[data-index=\'1\']').addClass('te-tab-active');
            
        });
            
    }
    
};
