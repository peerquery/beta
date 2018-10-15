'use strict';

var markup = require('markup-builder');

//jquery is already universal through the `ui.js` global file

(async () => {
    try {
        $('#body').html(await markup.build.content($('#temp').html()));
        $('#temp').remove();
    } catch (err) {
        console.log(err);
    }
})();
