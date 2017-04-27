var links = [];
chrome.storage.local.get('ivleVideoLinks', function(res) {
	for (var i = 0, len = res.ivleVideoLinks.length; i < len; i++) {
		var title = res.ivleVideoLinks[i].title;
		var link = res.ivleVideoLinks[i].link;
		links.push(res.ivleVideoLinks[i]);
		document.body.innerHTML += "<a href ='" + link + "' download='" + title + ".mp4'>" + title + "</a><br /><br />";
	}
});
chrome.storage.local.get('ivleTraverseLinks', function(res) {
	if (res.ivleTraverseLinks.length > 0) fetchLink (res, 0);
});

function fetchLink(res, i) {
	$.get(res.ivleTraverseLinks[i].link, function(data) {
	  	var linkStartIndex = data.indexOf("src=");
	  	if (linkStartIndex == -1) return;
	  	linkStartIndex += ("src='").length;

	  	var linkEndIndex = data.indexOf("index.html");
	  	if (linkEndIndex == -1 || linkEndIndex < linkStartIndex) return;

	  	var parsedLink = "http://vidcast.nus.edu.sg/camtasiarelay/" + data.substring(linkStartIndex, linkEndIndex) + "media/video.mp4";

		document.body.innerHTML += "<a href ='" + parsedLink + "' download='" + res.ivleTraverseLinks[i].title + ".mp4'>" + res.ivleTraverseLinks[i].title + "</a><br /><br />";


		if ((i + 1) == res.ivleTraverseLinks.length) return;
		fetchLink(res, i + 1);
	});

}