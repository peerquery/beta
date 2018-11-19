'use strict';

module.exports = function() {
    var path = window.location.pathname;
    if (path == '/projects')
        document.getElementById('projects-page').classList.add('navbar-active');
    if (path == '/queries')
        document.getElementById('queries-page').classList.add('navbar-active');
    if (path == '/reports')
        document.getElementById('reports-page').classList.add('navbar-active');
    if (path == '/peers')
        document.getElementById('peers-page').classList.add('navbar-active');
    if (path == '/curation')
        document.getElementById('curation-page').classList.add('navbar-active');
};
