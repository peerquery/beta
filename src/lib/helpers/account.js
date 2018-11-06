'use strict';

module.exports = {
    build: function(account) {
        return account
            .toLowerCase()
            .replace(/-/g, 'HYPHEN')
            .replace(/\./g, '--')
            .replace(/\HYPHEN/g, '---');
    },

    extract: function(url) {
        let index1 = url.lastIndexOf('--');
        let index2 = url.lastIndexOf('---');

        if (!index1 && !index2) return url.split('-')[0];

        index1 = index1 + 3;
        index2 = index2 + 4;

        let index = Math.max(index1, index2);

        let ind = url.indexOf('-', index);

        let substring = url.substring(0, ind);

        return substring.replace(/---/g, '-').replace(/--/g, '.'); //replace '---' before '--' else ...
    },

    make: function(account) {
        return account.replace(/---/g, '-').replace(/--/g, '.'); //replace '---' before '--' else ...
    },

    //validate: function(account) {}
};
