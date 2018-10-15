var markup = require('markup-builder');

$(window).on('load', function() {
    async function get() {
        try {
            var response = await Promise.resolve(
                $.get('/api/project/' + project_slug + '/home')
            );
            $('#home-loader').hide();
            $('#home-content').html(
                await markup.build.content(response[0].story)
            );
            //console.log(response);
        } catch (err) {
            //console.log(err);
            window.pqy_notify.warn('Sorry, an error occured. Please again');
            //window.location.reload();
        }
    }

    get();
});
