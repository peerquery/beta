'use strict';

var membership =
    '     ' +
    '                   <div class="content">  ' +
    '                       <div class="header">{{title}}</div>  ' +
    '                       <div class="description">  ' +
    '                          <span class="right floated">  ' +
    '                              <a href="/project/{{slug_id}}" target="_blank">  ' +
    '                                  <i class="long arrow alternate right link circular icon"></i>  ' +
    '                              </a>  ' +
    '                          </span>  ' +
    '                          <span class="time">{{created}}</span>  ' +
    '                       </div>  ' +
    '                   </div>  ' +
    '                   <div class="extra content">  ' +
    '                       <span class="left floated percent">  ' +
    '                           {{benefactor_rate}}  ' +
    '                           <i class="percent icon"></i>  ' +
    '                       </span>  ' +
    '                       <span class="right floated star">  ' +
    '                           <i class="star icon"></i>  ' +
    '                           {{role}}  ' +
    '                       </span>  ' +
    '                   </div>  ';

module.exports = membership;
