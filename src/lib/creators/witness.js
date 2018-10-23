'use strict';

module.exports = function witness(witness) {
    var item = document.createElement('div');
    item.className = 'item';

    var content1 = document.createElement('div');
    content1.className = 'right floated content';

    var btn = document.createElement('a');
    btn.className = 'ui button';
    btn.innerText = 'View';
    btn.href = '/peer/' + witness;

    content1.appendChild(btn);

    var img = document.createElement('img');
    img.className = 'ui avatar image';
    img.src = 'https://steemitimages.com/u/' + witness + '/avatar';
    img.onerror = function() {
        this.src = '/assets/images/placeholder.png';
        this.onerror = '';
    };

    var content2 = document.createElement('div');
    content2.className = 'content';

    var span_witness = document.createElement('span');
    span_witness.innerText = witness.toUpperCase();

    content2.appendChild(span_witness);

    item.appendChild(content1);
    item.appendChild(img);
    item.appendChild(content2);

    return item;
};
