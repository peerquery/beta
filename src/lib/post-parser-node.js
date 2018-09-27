'use strict';

var Remarkable = require('remarkable'),
    createDOMPurify = require('dompurify'),
    { JSDOM } = require('jsdom'),
    window = new JSDOM('').window,
    DOMPurify = createDOMPurify(window),
    DomParser = require('dom-parser'),
    parser = new DomParser();

module.exports = {
    first_img: function(text) {
        try {
            var src = text.match(
                /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|png|svg))/i
            )[0];
            if (src !== null || src !== undefined) return src;
            return '';
        } catch (err) {
            //console.log(err);
            return '';
        }
    },

    summary: function(html, count) {
        var md = new Remarkable({
            html: true,
            breaks: false,
            linkify: false,
            typographer: false,
            quotes: '“”‘’',
        });

        //sanitze html before appending to  'dom parser'
        var safeText = DOMPurify.sanitize(html);

        var mdText = md.render(safeText);
        mdText = '<div id=\'main\'> ' + mdText + ' </div>';

        var dom = parser.parseFromString(mdText);
        var textString = dom.getElementById('main').textContent;

        var stripedHtml = textString.replace(/<[^>]+>/g, '');
        var stripedNewline = stripedHtml.replace(/\r?\n|\r/g, ' ');
        var stripeImg = stripedNewline.replace(
            /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/gi,
            ' '
        );
        var trimHtml = stripeImg.trim();

        return trimHtml.substring(0, count) + '... ';
    },

    content: function(html) {
        var md = new Remarkable({
            html: true,
            breaks: false,
            linkify: false,
            typographer: false,
            quotes: '“”‘’',
        });

        //sanitze html before appending to  'dom parser'
        var safeText = DOMPurify.sanitize(html);

        var mdText = md.render(safeText);

        //lots of parsing work yet to be done

        return mdText;
    },

    clean: async function(html) {
        var clean = await DOMPurify.sanitize(html, { SAFE_FOR_JQUERY: true });

        return clean;
    },
};
