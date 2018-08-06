












	
	function parseHTML(html) {
	
		//console.log(html);
	
		var body = html;
	
		var md = new Remarkable({
			html: true, // Remarkable renders first then sanitize runs...
			breaks: false,
			linkify: false, // linkify is done locally
			typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
			quotes: '“”‘’',
		});
	
		
		
		//convert image links to image tags
		var link_images = body.replace(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif)(?!["\)]))/gi, image => {
			return '<img src="' + image + '">' + '<br/>';
		});
		
		
		
		//parser markdown
		var markdown_text = md.render(link_images);
		
		var urled_text = urlify(markdown_text);
		
		//console.log(urled_text)
		
		//convert hashtags to tags
		var link_tags = urled_text.replace(/(^|\s)(#[-a-z\d]+)/gi, tag => {
			if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
			const space = /^\s/.test(tag) ? tag[0] : '';
			const tag2 = tag.trim().substring(1);
			const tagLower = tag2.toLowerCase();
			return space + '<a target="_blank" href="https://steemit.com/trending/' + tagLower + ' ">' + tag + ' </a>';
		});

		
		// usertag (mention)
		// Cribbed from https://github.com/twitter/twitter-text/blob/v1.14.7/js/twitter-text.js#L90
		var link_mentions = link_tags.replace(
			/(^|[^a-zA-Z0-9_!#$%&*@＠\/]|(^|[^a-zA-Z0-9_+~.-\/#]))[@＠]([a-z][-\.a-z\d]+[a-z\d])/gi,
			(match, preceeding1, preceeding2, user) => {
				const userLower = user.toLowerCase();
				const valid = validate_account_name(userLower) == null;

				const preceedings = (preceeding1 || '') + (preceeding2 || ''); // include the preceeding matches if they exist

				return valid
					? preceedings + '<a target="_blank" href="/user/' + userLower + '">@' + user + '</a>' : preceedings + '@' + user;
			}
		);	
		
		
		//set the content of the temp element
		$('#temp').html(link_mentions);
	
		$("#temp a").each(function () {
			// Exit quickly if this is the wrong type of URL
			if (this.protocol !== 'http:' && this.protocol !== 'https:') {
				return;
			}
			
			// Find the ID of the YouTube video
			var id, matches;
			
			if (this.hostname === 'youtube.com' || this.hostname === 'm.youtube.com' || this.hostname === 'www.youtube.com' || this.hostname === 'youtu.be') {
				
				var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				var match = this.href.match(regExp);
				if (match && match[2].length == 11) {
					id = match[2];
			
					// Add the embedded YouTube video, and remove the link.
					if (id) {
			
					$(this)
						.before('<iframe width="640" height="360" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>')
						.remove();
					}
				
					
				} else {
					 return;
				}
				
				
				
			}

			
		});
	
	
	
	
		var final_text = $("#temp").html();
		$("#temp").html("");
		
		//
		var _out = DOMPurify.sanitize(final_text);
		
		return _out;
	
	}	
	
	
	



	
	function renderHTML(html, div) {
	
		//console.log(html);
	
		var body = html.body;
	
		var md = new Remarkable({
			html: true, // Remarkable renders first then sanitize runs...
			breaks: false,
			linkify: false, // linkify is done locally
			typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
			quotes: '“”‘’',
		});
	
		
		
		//convert image links to image tags
		var link_images = body.replace(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif)(?!["\)]))/gi, image => {
			return '<img src="' + image + '">' + '<br/>';
		});
		
		
		
		//parser markdown
		var markdown_text = md.render(link_images);
		
		var urled_text = urlify(markdown_text);
		
		//console.log(urled_text)
		
		//convert hashtags to tags
		var link_tags = urled_text.replace(/(^|\s)(#[-a-z\d]+)/gi, tag => {
			if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
			const space = /^\s/.test(tag) ? tag[0] : '';
			const tag2 = tag.trim().substring(1);
			const tagLower = tag2.toLowerCase();
			return space + '<a target="_blank" href="https://steemit.com/trending/' + tagLower + ' ">' + tag + ' </a>';
		});

		
		// usertag (mention)
		// Cribbed from https://github.com/twitter/twitter-text/blob/v1.14.7/js/twitter-text.js#L90
		var link_mentions = link_tags.replace(
			/(^|[^a-zA-Z0-9_!#$%&*@＠\/]|(^|[^a-zA-Z0-9_+~.-\/#]))[@＠]([a-z][-\.a-z\d]+[a-z\d])/gi,
			(match, preceeding1, preceeding2, user) => {
				const userLower = user.toLowerCase();
				const valid = validate_account_name(userLower) == null;

				const preceedings = (preceeding1 || '') + (preceeding2 || ''); // include the preceeding matches if they exist

				return valid
					? preceedings + '<a target="_blank" href="/user/' + userLower + '">@' + user + '</a>' : preceedings + '@' + user;
			}
		);	
		
		
		//set the content of the temp element
		$(div).html(link_mentions);
	
		$(div + " a").each(function () {
			// Exit quickly if this is the wrong type of URL
			if (this.protocol !== 'http:' && this.protocol !== 'https:') {
				return;
			}
			
			// Find the ID of the YouTube video
			var id, matches;
			
			if (this.hostname === 'youtube.com' || this.hostname === 'm.youtube.com' || this.hostname === 'www.youtube.com' || this.hostname === 'youtu.be') {
				
				var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				var match = this.href.match(regExp);
				if (match && match[2].length == 11) {
					id = match[2];
			
					// Add the embedded YouTube video, and remove the link.
					if (id) {
			
					$(this)
						.before('<iframe width="640" height="360" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>')
						.remove();
					}
				
					
				} else {
					 return;
				}
				
				
				
			}

			
		});
	
	
	
	
		var final_text = $("#temp").html();
		$("#temp").html("");
		
		//
		var _out = DOMPurify.sanitize(final_text);
		
		return _out;
	
	}	
	
	
	









	
	function validate_account_name(value) {
		let i, label, len, length, ref;

		if (!value) {
			return tt('account_name_should_not_be_empty');
		}
		
		length = value.length;
		
		if (length < 3) {
			return tt('account_name_should_be_longer');
		}
		
		if (length > 16) {
			return tt('account_name_should_be_shorter');
		}
	
		ref = value.split('.');
	
		for (i = 0, len = ref.length; i < len; i++) {
		
			label = ref[i];
	
			if (!/^[a-z]/.test(label)) {
					return tt(
						'each_account_segment_should_start_with_a_letter'
					);
			}
		
			if (!/^[a-z0-9-]*$/.test(label)) {
					return tt(
						'each_account_segment_should_have_only_letters_digits_or_dashes'
					);
			}
			if (/--/.test(label)) {
					return tt(
						'each_account_segment_should_have_only_one_dash_in_a_row'
					);
			}
			if (!/[a-z0-9]$/.test(label)) {
				return tt(
					'each_account_segment_should_end_with_a_letter_or_digit'
				);
			}
			if (!(label.length >= 3)) {
				return tt(
					'each_account_segment_should_be_longer'
				);
			}
		
		}
			
		return null;
			
	}
		
	
	
	function urlify(text) {
  
		return (text || "").replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, function(match, space, url){
			var hyperlink = url;
			if (!hyperlink.match('^https?:\/\/')) {
				hyperlink = 'http://' + hyperlink;
			}			
			return space + '<a href="' + hyperlink + '">' + url + '</a>';
		});
			
	};
	
	
