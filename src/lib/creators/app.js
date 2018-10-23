'use strict';

module.exports = function app(app, details, clss, account) {
    var item = document.createElement('div');
    item.className = 'item';

    var content1 = document.createElement('div');
    content1.className = 'right floated content';

    var view_btn = document.createElement('a');
    view_btn.className = 'ui teal button';
    view_btn.href = '/peer/' + app;
    view_btn.title = 'View';

    var view_i = document.createElement('i');
    view_i.className = 'unhide icon';

    var view_span = document.createElement('span');
    view_span.className = 'desktop-only';
    view_span.innerText = 'View';

    view_btn.appendChild(view_i);
    view_btn.appendChild(view_span);

    var revoke_btn = document.createElement('a');
    revoke_btn.className = 'ui red button';
    revoke_btn.style.display = account == active_user ? 'inline-block' : 'none';
    revoke_btn.target = '_blank';
    revoke_btn.href = 'https://v2.steemconnect.com/revoke/@' + app;
    revoke_btn.title = 'Revoke';

    var revoke_i = document.createElement('i');
    revoke_i.className = 'remove circle icon';

    var revoke_span = document.createElement('span');
    revoke_span.className = 'desktop-only';
    revoke_span.innerText = 'Revoke';

    revoke_btn.appendChild(revoke_i);
    revoke_btn.appendChild(revoke_span);

    content1.appendChild(view_btn);
    content1.appendChild(revoke_btn);

    var img = document.createElement('img');
    img.className = 'ui avatar image';
    img.src = 'https://steemitimages.com/u/' + app + '/avatar';
    img.onerror = function() {
        this.src = '/assets/images/placeholder.png';
        this.onerror = '';
    };

    var content2 = document.createElement('div');
    content2.className = 'content';

    var span_app = document.createElement('span');
    span_app.innerText = app.toUpperCase();

    var span_details = document.createElement('span');
    span_details.className = clss;
    span_details.innerText = details;

    content2.appendChild(span_app);
    content2.appendChild(span_details);

    item.appendChild(content1);
    item.appendChild(img);
    item.appendChild(content2);

    return item;
};
