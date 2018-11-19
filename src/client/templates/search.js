'use strict';

var search =
    '     ' +
    '                   <div class="label">  ' +
    '                       <img src="https://steemitimages.com/u/{{account}}/avatar">  ' +
    '                   </div>  ' +
    '                   <div class="content">  ' +
    '                       <div class="summary">  ' +
    '                           <a href="/{{type}}/{{permlink}}" target="_blank">{{title}}</a>  ' +
    '                           <div class="date">  ' +
    '                               {{created}}  ' +
    '                           </div>  ' +
    '                           <div class="date">  ' +
    '                              by <a href="/peer/{{account}}">@{{account}}</a>  ' +
    '                           </div>  ' +
    '                       </div>  ' +
    '                       <div class=" text">  ' +
    '                           {{summary}}   ' +
    '                       </div>  ' +
    '                  </div>  ';

module.exports = search;
