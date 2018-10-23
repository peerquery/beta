'use strict';

module.exports = function() {
    var classes = [
        'red',
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
        'grey',
        'black',
    ];
    return classes[Math.floor(Math.random() * classes.length)];
};
