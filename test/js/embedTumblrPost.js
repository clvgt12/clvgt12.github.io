/*
**************************************************************************
embedTumblrPost.js
- use Tumblr's API v1 to selectively embed posts into static webpage
--- use 'limit' to cap off max # of posts
--- use 'fancy_posts' to select Tumblr API, or html fallback, formatting
--- use debug flag to log diagnostics to console
--- use blog_id to locate tumblr blog via embed.tumblr.com calls
--- use blacklisted_hashtags to filter out unwanted posts 
--- specify DOM div 'top_dom_element_id' to embed output
**************************************************************************
<!DOCTYPE html>
<!-- test html document -->
<HTML>
<HEAD>
    <SCRIPT>
    let embedFeaturedTumblrPosts = new embedTumblrPosts({
        debug: 0,
        blog_id: 't:8bAqOf9pt_rnt414EUAB1g',
        limit: 2,
        blacklisted_hashtags: ['hidden'],
        top_dom_element_id: 'FeaturedPosts',
        fancy_posts: 1
    });
    let embedRecentTumblrPosts = new embedTumblrPosts({
        debug: 0,
        blog_id: 't:8bAqOf9pt_rnt414EUAB1g',
        limit: 5,
        blacklisted_hashtags: ['hidden', 'featured'],
        top_dom_element_id: 'RecentPosts',
        fancy_posts: 1
    });
    </SCRIPT>
</HEAD>
<BODY>

    <h1>Featured Posts</h1>
    <div id="FeaturedPosts"></div>
    <script>
        var scr=document.createElement('script');
        scr.src="https://srrpnj.tumblr.com/api/read/json?tagged=featured&callback=embedFeaturedTumblrPosts.embedPosts&rand="+Math.randInt(100000,999999);
        document.getElementById("FeaturedPosts").appendChild(scr);
    </script>    

    <h1>Recent Posts</h1>
    <div id="RecentPosts"></div>
    <script>
        var scr=document.createElement('script');
        scr.src="https://srrpnj.tumblr.com/api/read/json?callback=embedRecentTumblrPosts.embedPosts&rand="+Math.randInt(100000,999999);
        document.getElementById("RecentPosts").appendChild(scr);
    </script>

</BODY>
</HTML>
*/

Math.randInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};
String.prototype.searchList = function(list) {
	for (var i = 0; i < list.length; i++) {
		if (this.indexOf(list[i]) !== -1) {
			return i;
		}
	}
	return -1;
};
let embedTumblrPosts = function(params_) {
	// Object constructor, called when object is created with 'new'
	this.DEBUG = typeof params_.debug != 'undefined' ? params_.debug : null;
	this.BLOG_ID = typeof params_.blog_id != 'undefined' ? params_.blog_id : null;
	this.LIMIT = typeof params_.limit != 'undefined' ? params_.limit : null;
	this.BLACKLISTED_HASHTAGS = typeof params_.blacklisted_hashtags != 'undefined' ? params_.blacklisted_hashtags : null;
	this.TOP_DOM_ELEMENT = typeof params_.top_dom_element_id != 'undefined' ? params_.top_dom_element_id : null;
	this.FANCY_POSTS = typeof params_.fancy_posts != 'undefined' ? params_.fancy_posts : null;
	if (this.DEBUG) {
		console.log(JSON.stringify(params_));
	}
};
// --------------------------------------------------------
embedTumblrPosts.prototype.embedPlainPosts = function(node, post) {
	// Embed plain HTML Tumblrs using the html block contained in the API v1 result
	var outerDiv = document.createElement('div');
	var headerDiv = document.createElement('div');
	var innerDiv = document.createElement('div');
	outerDiv.setAttribute('class', 'tumblr-summary-post-outer');
	headerDiv.setAttribute('class', 'tumblr-summary-post-header');
	var div1 = document.createElement('div');
	var img = document.createElement('img');
	img.setAttribute('src', post.tumblelog.avatar_url_48);
	img.setAttribute('width', 48);
	div1.appendChild(img);
	var div2 = document.createElement('div');
	var atag = document.createElement('a');
	atag.setAttribute('href', post.url);
	atag.innerHTML = post.tumblelog.name;
	div2.appendChild(atag);
	headerDiv.appendChild(div1);
	headerDiv.appendChild(div2);
	innerDiv.setAttribute('class', 'tumblr-summary-post-inner');
	var inner_p = document.createElement('p');
	switch (post.type) {
		case 'regular':
			inner_p.innerHTML = post['regular-body'];
			innerDiv.appendChild(inner_p);
			break;
		case 'link':
			var postTitleHeader = document.createElement('h1');
			postTitleLink = document.createElement('a');
			postTitleLink.setAttribute('href', post['link-url']);
			postTitleLink.innerHTML = post['link-text'];
			innerDiv.appendChild(postTitleHeader).appendChild(postTitleLink);
			inner_p.innerHTML = post['link-description'];
			innerDiv.appendChild(inner_p);
			break;
		default:
			inner_p.innerHTML = "This post is best viewed on our Tumblr site.  Click on the following link to take you there:"
			atag = document.createElement('a');
			atag.setAttribute('href', post.url);
			atag.innerHTML = (post.slug || 'Click HERE');
			innerDiv.appendChild(inner_p);
			innerDiv.appendChild(atag);
	}
	var tags_p = document.createElement('p');
	tags_p.setAttribute('class', 'tumblr-summary-post-footer');
	tags_p.innerHTML = "Tags: " + post.tags;
	innerDiv.appendChild(inner_p).appendChild(tags_p);
	outerDiv.appendChild(headerDiv);
	outerDiv.appendChild(innerDiv);
	node.appendChild(outerDiv);
};
// --------------------------------------------------------
embedTumblrPosts.prototype.embedPosts = function(tumblr_api_read) {
	try {
		this.POSTS = tumblr_api_read.posts;
	} catch (err) {
		console.log('tumblr_api_read data object is undefined!');
		void(0);
	}
	const node = document.getElementById(this.TOP_DOM_ELEMENT);
	this.LEN = this.POSTS.length;
	if (this.DEBUG) {
		console.log('++embedPosts starts');
	}
	for (var i = 0; i < this.LEN; ++i) {
		var post = this.POSTS[i];
		if (this.DEBUG) {
			console.log("id=" + post.id);
			console.log('url-slug: ' + post['url-with-slug']);
			console.log("i=" + i + " len=" + this.LEN);
		}
		if (this.DEBUG) {
			console.log('post tag array:' + post.tags);
		}
		if (JSON.stringify(post.tags).searchList(this.BLACKLISTED_HASHTAGS) !== -1) {
			if (this.DEBUG) {
				console.log('found blacklisted hashtag');
			}
			continue;
		}
		var recent = document.createElement('div');
		if (this.FANCY_POSTS) {
			recent.setAttribute("class", "tumblr-post");
			recent.setAttribute("data-href", this.createEmbedApiHref(post.id));
		}
		this.embedPlainPosts(recent, post);
		node.appendChild(recent);
		if (this.FANCY_POSTS) {
			var scr = document.createElement('script');
			scr.src = "https://assets.tumblr.com/post.js";
			node.appendChild(scr);
		}
		if (this.DEBUG) {
			console.log('--embedPosts');
		}
		if (--this.LIMIT === 0) {
			if (this.DEBUG) {
				console.log('specified limit reached, exiting loop');
			}
			break;
		}
	}
	if (this.DEBUG) {
		console.log('++embedPosts ends');
	}
}
embedTumblrPosts.prototype.createEmbedApiHref = function(p) {
	// returns URL to call Tumblr API 
	return 'https://embed.tumblr.com/embed/post/{0}/{1}/v2'.format(this.BLOG_ID, p);
}