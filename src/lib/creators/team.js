'use strict';

const randomClass = require('../helpers/random-class'),
    timeago = require('timeago.js'),
    timeagoInstance = timeago();

module.exports = function(data) {
    var manage =
        window.owner !== data.account
            ? '<i data-account="' +
              data.account +
              '" class="cog link manage icon"></i>'
            : '';

    var item = document.createElement('div');
    item.className = 'item';
    item.id = data.account + '-item';

    var img = document.createElement('img');
    img.className = 'ui avatar image';
    img.src = 'https://steemitimages.com/u/' + data.account + '/avatar';
    img.onerror = function() {
        this.src = '/assets/images/placeholder.png';
        this.onerror = '';
    };

    var content = document.createElement('div');
    content.className = 'content';
    content.style.position = 'relative';

    var a = document.createElement('a');
    a.className = 'header';
    a.href = '/peer/' + data.account;
    a.target = '_blank';
    a.innerText = data.account;

    var role = document.createElement('span');
    role.className = 'floating ui ' + randomClass() + ' mini label';
    role.innerText = data.role;

    var description = document.createElement('small');
    description.className = 'description';
    description.title = new Date(data.created).toDateString();
    description.innerHTML =
        'Joined ' + timeagoInstance.format(data.created) + manage;

    content.appendChild(a);
    content.appendChild(role);
    content.appendChild(description);

    item.appendChild(img);
    item.appendChild(content);

    return item;
};
