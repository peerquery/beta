//

//show edit button
window.load = function() {
    if (window.account == window.active_user) $('#edit_btn').show();
};

//social media button hrefs

document.getElementById('fb-share').href =
    'https://www.facebook.com/sharer/sharer.php?u=' + window.location;

document.getElementById('twitter-share').href =
    'http://twitter.com/share?text=' +
    document.title +
    '&url=' +
    window.location +
    '&hashtags=peerquery';

document.getElementById('gplus-share').href =
    'https://plus.google.com/share?url=' + window.location;

document.getElementById('linkedin-share').href =
    'https://www.linkedin.com/shareArticle?mini=true&url=' +
    window.location +
    '&title=' +
    encodeURI(document.title) +
    '&summary=&source=peerquery.com';

$('#updateBtn').click(async function() {
    try {
        var data = {};

        $(this).addClass('disabled');
        $('#editForm').addClass('loading');

        data.first_name = $('#firstnameInput').val();
        data.last_name = $('#lastnameInput').val();
        data.about = $('#aboutInput').val();

        data.skill = $('#skillInput')
            .val()
            .toLowerCase()
            .trim();
        data.skill = data.skill[0].toUpperCase() + data.skill.substring(1);

        data.interest = $('#interestInput').val();
        data.location = $('#locationInput').val();

        data.position = $('#positionInput').val();
        data.company = $('#companyInput').val();
        data.industry = $('#industryInput').val();

        data.email = $('#emailInput').val();
        if (data.email) {
            data.email =
                data.email.indexOf('mailto:') < 0
                    ? 'mailto:' + data.email
                    : data.email;
        }

        data.website = $('#websiteInput').val();
        if (data.website) {
            data.website =
                data.website.indexOf('://') === -1
                    ? 'http://' + data.website
                    : data.website;
        }

        //social
        data.facebook = $('#facebookInput').val();
        if (data.facebook) {
            data.facebook =
                data.facebook.indexOf('facebook.com/') === -1
                    ? 'http://facebook.com/' + data.facebook
                    : data.facebook;
            data.facebook =
                data.facebook.indexOf('://') === -1
                    ? 'http://' + data.facebook
                    : data.facebook;
        }

        data.twitter = $('#twitterInput').val();
        if (data.twitter) {
            data.twitter =
                data.twitter.indexOf('twitter.com/') === -1
                    ? 'http://twitter.com/' + data.twitter
                    : data.twitter;
            data.twitter =
                data.twitter.indexOf('://') === -1
                    ? 'http://' + data.twitter
                    : data.twitter;
        }

        data.linkedin = $('#linkedinInput').val();
        if (data.linkedin) {
            data.linkedin =
                data.linkedin.indexOf('linkedin.com/') === -1
                    ? 'http://linkedin.com/' + data.linkedin
                    : data.linkedin;
            data.linkedin =
                data.linkedin.indexOf('://') === -1
                    ? 'http://' + data.linkedin
                    : data.linkedin;
        }

        var status = await Promise.resolve(
            $.post('/api/private/user/update', data)
        );
        //console.log(status);

        window.set_updates(data);
    } catch (err) {
        console.log(err);
        window.pqy_notify.warn('Sorry, an error occured. Please again');
        //window.location.reload();
    }
});

$('.limitedText').on('keyup', function() {
    var maxLength = $(this).attr('maxlength');
    if (maxLength == $(this).val().length) {
        window.pqy_notify.warn(
            'You can\'t write more than ' + maxLength + ' characters'
        );
    }
});
