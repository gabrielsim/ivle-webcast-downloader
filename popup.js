var links = [];
chrome.storage.local.get('videoLinks', function(res) {
	for (var i = 0, len = res.videoLinks.length; i < len; i++) {
		var title = res.videoLinks[i].title;
		var link = res.videoLinks[i].link;
		links.push(res.videoLinks[i]);
		document.body.innerHTML += "<a href ='" + link + "' download='" + title + "'>" + title + "</a><br /><br />";
	}
});
