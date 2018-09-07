
'use strict';

var project = '     '  + 
 '   	  <div class="content">  '  + 
 '   		<a class="right floated ui red horizontal label"> {{ tag }} </a>  '  + 
 '   		<img class="ui avatar image" src="{{logo}}"> <a href="/project/{{slug}}"> {{ slug }} </a> '  + 
 '   	  </div>  '  + 
 '   	  <div class="content">  '  + 
 '   		<div class="header"> {{ name }} </div>  '  + 
 '   		<div class="meta">  '  + 
 '   		  <span class="category">{{ description }}</span>  '  + 
 '   		</div>  '  + 
 '   		<div class="description">  '  + 
 '   		  <p></p>  '  + 
 '   		</div>  '  + 
 '   	  </div>  '  + 
 '   	  <div class="content">  '  + 
 '   		<span class="right floated">  '  + 
 '   		  <i class="heart outline like icon"></i>  '  + 
 '   		  ... likes  '  + 
 '   		</span>  '  + 
 '   		<i class="users icon"></i>  '  + 
 '   		{{member_count}} members  '  + 
 '   	  </div>  '  + 
 '   	  <div class="extra content">  '  + 
 '   		<span class="right floated">  '  + 
 '   		  <i class="history icon"></i>  '  + 
 '   		  {{created}}  '  + 
 '   		</span>  '  + 
 '   		<a>  '  + 
 '   		  <i class="clipboard icon"></i>  '  + 
 '   		  {{report_count}} reports  '  + 
 '   		</a>  '  + 
 '   	  </div>  '  + 
 '   	  <div class="extra content">  '  + 
 '   		<span class="right floated">  '  + 
 '   		  <i class="marker icon"></i>  '  + 
 '   		  {{location}} '  + 
 '   		</span>  '  + 
 '   		<a>  '  + 
 '   		  <i class="power off icon"></i>  '  + 
 '   		  {{state}}  '  + 
 '   		  </a>  '  + 
 '   	  </div>  '  + 
 '   	  <div class="extra content">  '  + 
 '   		<div class="right floated author">  '  + 
 '   		  <img class="ui avatar image" src="https://steemitimages.com/u/{{owner}}/avatar"> by <a href="/@{{owner}}">{{ owner }}</a>  '  + 
 '   		</div>  '  + 
 '   	  </div>  ';
 
 module.exports = project;