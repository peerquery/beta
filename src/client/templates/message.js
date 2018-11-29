'use strict';

var message =
    '     ' +
    '               <img class="ui avatar image" src="https://steemitimages.com/u/{{author}}/avatar">  ' +
    '               <div class="content">  ' +
    '                   <div class="description"><a class="read" id="{{slug_id}}">{{title}}</a></div>  ' +
    '                   <small>  ' +
    '                       <a class="header" href="/peer/{{author}}" target="_blank" style="display:inline-block">{{author}}</a>  ' +
    '                       <span style="color: rgba(0,0,0,.4); margin-left: 0.5rem">{{created}}</span>  ' +
    '                   </small>  ' +
    '              </div>  ';

module.exports = message;
