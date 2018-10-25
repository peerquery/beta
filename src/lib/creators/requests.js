'use strict';

const randomClass = require('../helpers/random-class'),
    timeago = require('timeago.js'),
    timeagoInstance = timeago();

module.exports = function(data) {
    var item = document.createElement('div');
    item.className = 'item';
    item.id = data.account + '-item';

    var content = document.createElement('div');
    content.className = 'right floated content';

    var approve_btn = document.createElement('div');
    approve_btn.className = 'ui approve circular icon button';
    approve_btn.setAttribute('data-account', data.account);

    var i_approve = document.createElement('i');
    i_approve.className = 'green user plus icon';
    approve_btn.appendChild(i_approve);

    var reject_btn = document.createElement('div');
    reject_btn.className = 'ui reject circular icon button';
    reject_btn.setAttribute('data-account', data.account);

    var i_reject = document.createElement('i');
    i_reject.className = 'red user times icon';
    reject_btn.appendChild(i_reject);

    content.appendChild(approve_btn);
    content.appendChild(reject_btn);

    var img = document.createElement('img');
    img.className = 'ui avatar image';
    img.src = 'https://steemitimages.com/u/' + data.account + '/avatar';
    img.onerror = function() {
        this.src = '/assets/images/placeholder.png';
        this.onerror = '';
    };

    var a = document.createElement('a');
    a.className = 'content';
    a.href = '/peer/' + data.account;
    a.target = '_blank';
    a.innerText = data.account;

    var span = document.createElement('span');
    span.className = 'ui ' + randomClass() + ' mini circular label';
    span.innerText = timeagoInstance.format(data.created);

    item.appendChild(content);
    item.appendChild(img);
    item.appendChild(a);
    item.appendChild(span);

    return item;
};
