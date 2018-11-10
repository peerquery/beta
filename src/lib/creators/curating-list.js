'use strict';

module.exports = function(data, modal_mode) {
    var item = document.createElement('div');
    item.className = 'item';
    item._id = data._id;

    var button = document.createElement('button');
    button.className = 'view-post right floated circular ui icon button';
    button.innerHTML = '<i class=\'icon settings\'></i>';

    button.setAttribute('data-author', data.author);
    button.setAttribute('data-curator', data.curation_curator);
    button.setAttribute('data-title', data.title);
    button.setAttribute('data-rate', data.curation_rate);
    button.setAttribute('data-body', data.body);
    button.setAttribute('data-url', data.url);
    button.setAttribute('data-id', data._id);

    var img = document.createElement('img');
    img.className = 'ui avatar image';
    img.src = 'https://steemitimages.com/u/' + data.author + '/avatar';

    var content = document.createElement('div');
    content.className = 'content';

    var a = document.createElement('a');
    a.className = 'header';
    a.innerHTML = data.title;
    a.href = '/curation/trail/@' + data.author + '/' + data.permlink;
    a.setAttribute('target', '_blank');

    var description = document.createElement('div');
    description.className = 'description';

    if (modal_mode == 'ignored' || modal_mode == 'lost') {
        description.innerHTML =
            '<small>Authored by <a target=\'_blank\' href=\'/peer/' +
            data.author +
            '\'><b>@' +
            data.author +
            '</b></a></small>';
    } else {
        description.innerHTML =
            '<small>Authored by <a target=\'_blank\' href=\'/peer/' +
            data.author +
            '\'><b>@' +
            data.author +
            '</b></a>, curated by <a target=\'_blank\' href=\'/curation/curator/' +
            data.curation_curator +
            '\'><b>@' +
            data.curation_curator +
            '</b></a> as - <em>' +
            data.curation_rate_name +
            '</em></small>';
    }

    content.appendChild(a);
    content.appendChild(description);

    item.appendChild(button);
    item.appendChild(img);
    item.appendChild(content);

    return item;
};
