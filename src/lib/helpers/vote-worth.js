'use strict';

module.exports = function(
    weight,
    voting_power,
    final_vest,
    recent_claims,
    reward_balance,
    sbd_median_price
) {
    var power = (voting_power * weight) / 10000 / 50;
    var rshares = (power * final_vest) / 10000;
    var estimates = (
        (rshares / recent_claims) *
        reward_balance *
        sbd_median_price
    ).toFixed(2);
    return estimates;
};
