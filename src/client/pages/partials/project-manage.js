$(window).on('load', function() {
    //jquery is already universal through the `scripts.js` global file

    $('#update_action_button').on('click', async function() {
        try {
            $(this).addClass('disabled');
            window.pqy_notify.inform('Updating project, please wait');

            let data = {
                slug_id: slug_id,
                msg: $('#msg').val(),
                uri: $('#uri').val(),
            };

            var response = await Promise.resolve(
                $.post('/api/private/update/project/action_button', data)
            );

            window.pqy_notify.success('Successfully updated action button');
        } catch (err) {
            console.log(err);
            window.pqy_notify.warn('Sorry, an error occured. Please again');
            //window.location.reload();
        }
    });
});
