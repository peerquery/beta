'use strict';

module.exports = function(issues) {
    var issues_markup = '<div class="ui right pointing label">Issued in:</div>';

    for (var x in issues) {
        issues_markup =
            issues_markup + '<a class="ui basic label">' + issues[x] + '</a>';
    }

    return issues_markup;
};
