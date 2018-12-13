'use strict';

var sidebar_query =
    '     ' +
    '                   <div class="label">  ' +
    '                       <img src="https://steemitimages.com/u/{{author}}/avatar">  ' +
    '                   </div>  ' +
    '                   <div class="content">  ' +
    '                       <div class="summary">  ' +
    '                           <a href="/query/{{permlink}}">{{title}}</a>' +
    '                           <div class="date">  ' +
    '                               {{created}}  ' +
    '                           </div>  ' +
    '                           <div class="date">  ' +
    '                               {{view_count}} views  ' +
    '                           </div>  ' +
    '                       </div>  ' +
    '                  </div>  ';

module.exports = sidebar_query;
