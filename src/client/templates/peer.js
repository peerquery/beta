'use strict';

var peer =
    '     ' +
    '   	<div class="content">  ' +
    '   		<div class="right floated meta">  ' +
    '   			{{skill}}  ' +
    '   		</div>  ' +
    '   		<img class="ui avatar image" src="https://steemitimages.com/u/{{account}}/avatar" width="300" height="300">  ' +
    '   	</div>  ' +
    '   	<div class="content">  ' +
    '   		<div class="header">  ' +
    '   			{{account}}  ' +
    '   		</div>  ' +
    '   		<div class="ui sub header">  ' +
    '   			<a>{{about}}</a>  ' +
    '   		</div>  ' +
    '   		<div class="description">  ' +
    '   			<i class="coffee icon"></i> Building <a href="/project/{{last_project_slug_id}}">{{last_project_title}}</a></div>  ' +
    '   		</div>  ' +
    '   	<div class="extra content">  ' +
    '   		<span class="right floated" title=""></span>  ' +
    '   		<span><i class="history icon"></i>{{position}} at {{company}}</span>  ' +
    '   	</div>  ' +
    '   	<a class="ui bottom attached button" href="/peer/{{account}}">  ' +
    '   		<i class="eye icon"></i>  ' +
    '   		See account  ' +
    '   	</a>  ';

module.exports = peer;
