'use strict';

module.exports = function(rate) {
    if (rate == '1') return 'Nice';
    else if (rate == '3') return 'Average';
    else if (rate == '5') return 'Interesting';
    else if (rate == '10') return 'Genius';
    else if (rate == '15') return 'Awesome';
    else if (rate == '20') return 'Remarkable';
    else if (rate == '25') return 'Exceptional';
    else if (rate == '30') return 'Outstanding';
    else if (rate == '0') return 'Rejected';
};
