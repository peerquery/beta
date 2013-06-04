'use strict';

module.exports = {
    json: function(exportObj, exportName) {
        var dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(exportObj, null, 4));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', exportName + '.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },
};
