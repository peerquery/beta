'use strict';

module.exports = function list_featured_reports(data) {
    var divMain = document.createElement('div');
    divMain.className = 'event';

    var divLabel = document.createElement('div');
    divLabel.className = 'label';
    divLabel.style.marginTop = '10px';

    var user_img = document.createElement('img');
    user_img.src = 'https://steemitimages.com/u/' + data.author + '/avatar';
    user_img.onerror = function() {
        this.src = '/assets/images/placeholder.png';
        this.onerror = '';
    };
    divLabel.appendChild(user_img);

    var divContent = document.createElement('div');
    divContent.className = 'content';

    var metaSmall = document.createElement('small');
    //metaSmall.innerHTML = '<em><span>' + data.created + '</span> by <a href=\'/peer/' + data.author + '\'>' + data.author + '</a> in ' + '<a href=\'#\'>' + data.category + '</a></em>';
    metaSmall.innerHTML =
        '<em><span>' +
        data.created +
        '</span> by <a href=\'/peer/' +
        data.author +
        '\'>' +
        data.author +
        '</a></em>';
    divContent.appendChild(metaSmall);

    var divSummary = document.createElement('div');
    divSummary.className = 'summary';

    var data_title = document.createElement('a');
    data_title.innerText = data.title.substring(0, 150);
    data_title.href = '/report/' + data.permlink;
    divSummary.appendChild(data_title);

    divContent.appendChild(divSummary);
    divContent.appendChild(metaSmall);

    divMain.appendChild(divLabel);
    divMain.appendChild(divContent);

    return divMain;
};
