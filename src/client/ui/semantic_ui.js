'use strict';

module.exports = function() {
    $('.ui.menu .ui.dropdown').dropdown({
        on: 'hover',
    });

    $('.ui.menu a.item').on('click', function() {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
    });

    $('.ui.menu .ui.dropdown').dropdown({ on: 'hover' });

    $('.ui.menu a.item').on('click', function() {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
    });

    $('.ui.dropdown').dropdown();

    //------------post preview popup system

    $('#item-container').on('click', '.pop', function() {
        var el = this;

        jQuery('.ui.modal').modal('show');

        $('.ui.modal')
            .modal({
                onShow: function() {
                    //window.pqy_notify.warn('Showing modal');
                    //console.log(this); //works but rather only logs the real modal itself!
                    document.getElementById('modal_href').href =
                        '/@' + el.dataset.account + '/' + el.dataset.permlink;
                    document.getElementById('modal_title').innerHTML =
                        el.dataset.title;
                    document.getElementById('modal_author').innerHTML =
                        '@' + el.dataset.account;
                    document.getElementById('modal_content').innerHTML =
                        el.dataset.body;
                    return false;
                },
            })
            .modal('show');
    });
};
