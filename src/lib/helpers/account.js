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

        let substring = url.substring(0, Math.max(index1, index2));

        return substring.replace(/---/g, '-').replace(/--/g, '.'); //replace '---' before '--' else ...
    },

    //validate: function(account) {}
};
