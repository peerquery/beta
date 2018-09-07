
'use strict';

var report_view = '     '  + 
 '   	<!-- title -->  '  + 
 '       <h1 class="ui header" id="title"> {{ title }}  '  + 
 '   	</h1>  '  + 
 '   	  '  + 
 '   	<br/>  '  + 
 '   	  '  + 
 '   	<div class="ui grid">  '  + 
 '   		<div class="row bottom aligned">  '  + 
 '   		<div class="ten wide column">  '  + 
 '   				<a class="ui blue image label" id="author_href">  '  + 
 '   					<img id="author-img" src="{{author_img}}">  '  + 
 '   						<span id="author">{{author}}</span>  '  + 
 '   						<span id="author-rep"></span>  '  + 
 '   					<div class="detail desktop-only" id="type">{{type}}</div>  '  + 
 '   				</a>  '  + 
 '   				<a class="ui tag label" id="category">{{category}}</a>  '  + 
 '   		</div>  '  + 
 '   		<div class="six wide column right aligned">  '  + 
 '   			<a class="ui label">  '  + 
 '   				<i class="wait icon"></i>  '  + 
 '   				<span class="timeago" id="created">{{created}}</span>  '  + 
 '   			</a>  '  + 
 '   			  '  + 
 '   		</div>  '  + 
 '   		</div>  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	<div class="ui inverted section divider">  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	<!-- post container and tags -->  '  + 
 '   	<div id="post-container" class="">  '  + 
 '   	  '  + 
 '   	<div id="post-body" class="post-body"> {{body}} '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	<br/>  '  + 
 '   	  '  + 
 '   	<div id="issues">{{issues}}  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	<div class="ui inverted section divider">  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	</div>  '  + 
 '   	<!-- end of post container and tags -->  '  + 
 '       '  + 
 '       '  + 
 '       '  + 
 '     <div class="ui tiny four statistics">  '  + 
 '     <a id="author-href" href="{{author_href}}" class="ui tiny statistic">  '  + 
 '       <div class="value">  '  + 
 '         <img src="{{author_img}}" id="author-image" class="ui circular inline image"/>  '  + 
 '         <span id="author-reputation">{{author_rep}}</span>  '  + 
 '       </div>  '  + 
 '       <div class="label" id="author-account">{{author}}  '  + 
 '       </div>  '  + 
 '     </a>  '  + 
 '     <div class="ui tiny statistic">  '  + 
 '       <div class="value">  '  + 
 '         <i class="dollar icon"></i>  '  + 
 '   	  <span id="earned">{{earned}}</span>  '  + 
 '       </div>  '  + 
 '       <div class="label">  '  + 
 '         Earned  '  + 
 '       </div>  '  + 
 '     </div>  '  + 
 '     <div class="ui tiny statistic voter-popup" id="post-voter-main">  '  + 
 '       <div class="value">  '  + 
 '         <i class="angle up icon" id="netvotes"></i>  '  + 
 '   	  <span id="votes">{{active_votes}}</span>  '  + 
 '       </div>  '  + 
 '       <div class="label">  '  + 
 '         Votes  '  + 
 '       </div>  '  + 
 '     </div>  '  + 
 '     <div class="ui tiny statistic">  '  + 
 '       <div class="value">  '  + 
 '         <i class="comments icon"></i>  '  + 
 '   	  <span id="responsescount">{{active_comments}}</span>  '  + 
 '       </div>  '  + 
 '       <div class="label">  '  + 
 '         Responses  '  + 
 '       </div>  '  + 
 '     </div>  '  + 
 '   </div>  '  + 
 '       '  + 
 '       '  + 
 '       '  + 
 '       '  + 
 '   	  '  + 
 '   	<div class="ui inverted section divider">  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	<div style="margin-bottom:10px;">  '  + 
 '   	  '  + 
 '   	<button id="follow-btn" class="ui disabled button" title="Follow">  '  + 
 '   		<i class="user icon"></i>  '  + 
 '   		<span class="desktop-only">Follow</span>  '  + 
 '   	</button>  '  + 
 '   	  '  + 
 '   	<button id="share-toggle" class="ui right floated button" title="Share">  '  + 
 '   		<i class="share alternate icon"></i>  '  + 
 '   		<span class="desktop-only">Share</span>  '  + 
 '   	</button>  '  + 
 '   	  '  + 
 '   	<button id="resteem" class="ui right disabled floated button" title="Re Steem">  '  + 
 '   		<i class="retweet icon"></i>  '  + 
 '   		<span class="desktop-only">Re Steem</span>  '  + 
 '   	</button>  '  + 
 '   	  '  + 
 '   	<button id="response-toggle" class="ui right disabled floated button" title="Respond">  '  + 
 '   		<i class="reply icon"></i>  '  + 
 '   		<span class="desktop-only">Respond</span>  '  + 
 '   	</button>  '  + 
 '   	  '  + 
 '   	<button id="vote-toggle" class="ui right disabled floated button" onClick="votePanelBtn(this.id);" title="Upvote">  '  + 
 '   		<span id="qvotespan">  '  + 
 '   			<i class="thumbs up icon"></i>  '  + 
 '   			<span class="desktop-only">Upvote</span>  '  + 
 '   		</span>  '  + 
 '   	</button>  '  + 
 '   	  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	<br/>  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	<div class="ui clearing segment middle aligned stackable grid" id="slider-area" style="display:none">  '  + 
 '   	  '  + 
 '   	<div class="ui slidercontainer twelve wide column">  '  + 
 '   		<input type="range" min="100" max="10000" value="500" class="slider" id="qRange">  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	<div class="four wide column">  '  + 
 '   	<div class="ui mini right floated left labeled button">  '  + 
 '   		<a class="ui basic right pointing label">  '  + 
 '   			<i class="heart icon"></i>  '  + 
 '   		</a>  '  + 
 '   		<div class="ui mini button" id="vote-btn" data-value="500" data-href="" data-votestate="false" data-author="" tabindex="0" onClick="vote(this.id)">  '  + 
 '   			+5%  '  + 
 '   		</div>  '  + 
 '   	</div>  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	  '  + 
 '   	<div id="share-area" style="display:none">  '  + 
 '   	  '  + 
 '   	<a class="ui facebook button" target="_blank" id="fb-btn" href="{{fb}}">  '  + 
 '   		<i class="facebook icon"></i>  '  + 
 '   		<span class="desktop-only">Facebook</span>  '  + 
 '   	</a>  '  + 
 '   	<a class="ui twitter button" target="_blank" id="twitter-btn" href="{{twitter}}">  '  + 
 '   		<i class="twitter icon"></i>  '  + 
 '   		<span class="desktop-only">Twitter</span>  '  + 
 '   	</a>  '  + 
 '   	<a class="ui google plus button" target="_blank" id="google-btn" href="{{gplus}}">  '  + 
 '   		<i class="google plus icon"></i>  '  + 
 '   		<span class="desktop-only">Google Plus</span>  '  + 
 '   	</a>  '  + 
 '   	<a class="ui linkedin button" target="_blank" id="linked-btn" href="{{linkedin}}">  '  + 
 '   		<i class="linkedin icon"></i>  '  + 
 '   		<span class="desktop-only">LinkedIn</span>  '  + 
 '   	</a>  '  + 
 '   	<a class="ui teal button" target="_blank" id="reddit-btn" href="{{reddit}}">  '  + 
 '   		<i class="reddit icon"></i>  '  + 
 '   		<span class="desktop-only">Reddit</span>  '  + 
 '   	</a>  '  + 
 '   	<a class="ui tumblr button" target="_blank" id="tumblr-btn" href="{{tumblr}}">  '  + 
 '   		<i class="tumblr icon"></i>  '  + 
 '   		<span class="desktop-only">Tumblr</span>  '  + 
 '   	</a>  '  + 
 '   	  '  + 
 '   	</div>  '  + 
 '   	  '  + 
 '   	  '  + 
 '  	  ' ; 
 
 module.exports = report_view;