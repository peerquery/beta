var downloader = require('./../../../lib/helpers/downloader');

$(window).on('load', function() {
    //jquery is already universal through the `scripts.js` global file

    async function export_data(type) {
        try {
            window.pqy_notify.inform('Fetching data, please wait');

            let data = {
                slug_id: project_slug,
                type: type,
            };

            var response = await Promise.resolve(
                $.post('/api/private/project/export', data)
            );

            if (!response)
                return window.pqy_notify.warn(
                    'Sorry, an error occured. Please again'
                );

            window.pqy_notify.inform(
                'Successfully fetched data, now downloading'
            );

            downloader.json(response, slug_id);
        } catch (err) {
            console.log(err);
            window.pqy_notify.warn('Sorry, an error occured. Please again');
            window.location.reload();
        }
    }

    $('#json').on('click', function() {
        $(this).addClass('disabled');
        export_data('json');
    });

    $('#xml').on('click', function() {
        $(this).addClass('disabled');
        export_data('xml');
    });

    $('#authorize_transfer').on('click', async function() {
        try {
            $(this).addClass('disabled');

            //let new_owner = $('#teamField').dropdown('get value');

            let new_owner = $('#input').val();
            let data = {
                new_owner: new_owner,
                slug_id: slug_id,
            };

            window.pqy_notify.inform('Tranfering project, please wait');

            var response = await Promise.resolve(
                $.post('/api/private/project/transfer', data)
            );

            window.pqy_notify.inform('Successfully tranfered project');

            window.location.href = '/project/' + project_slug;
        } catch (err) {
            console.log(err);
            window.pqy_notify.warn('Sorry, an error occured. Please again');
            //window.location.reload();
        }
    });

    $('#authorize_delete').on('click', async function() {
        try {
            $(this).addClass('disabled');

            window.pqy_notify.inform('Deleting project, please wait');
            let data = {
                title: window.project_title,
                slug_id: slug_id,
            };

            var response = await Promise.resolve(
                $.post('/api/private/project/delete', data)
            );

            window.pqy_notify.inform('Successfully deleted project');

            window.location.href = '/projects';
        } catch (err) {
            console.log(err);
            window.pqy_notify.warn('Sorry, an error occured. Please again');
            //window.location.reload();
        }
    });
});
