var source = document.documentElement.innerHTML;
var startIndex = 0, endIndex;
var videoLinks = [];
var traverseLinks = [];
var url = window.location.href;

if (url.includes("ivle.nus.edu.sg/v1/Webcast")) {
	// parse Webcast
	while (true) {
		startIndex = source.indexOf('<a id="aiPodcast', startIndex);
		if (startIndex == -1) break;

		endIndex = source.indexOf("</b>", startIndex);
		if (endIndex < startIndex) break;
		endIndex += ("</b>").length;

		var content = source.substring(startIndex, endIndex);

		//parse link
		var linkStartIndex = content.indexOf("http");
		if (linkStartIndex == -1) break;

		var linkEndIndex = content.indexOf(".mp4");
		if (linkEndIndex == -1) {
			linkEndIndex = content.indexOf(".mp3");
		}
		if (linkEndIndex == -1 || linkEndIndex < linkStartIndex) break;
		linkEndIndex += (".mp4").length;

		var parsedLink = content.substring(linkStartIndex, linkEndIndex);
		parsedLink = parsedLink.replace("/StreamInBrowser/", "/Stream/");
		parsedLink = parsedLink.replace(".mp3", ".mp4");

		//parse title
		var titleStartIndex = content.indexOf("<b>");
		if (titleStartIndex == -1) break;
		titleStartIndex += ("<b>").length;

		var titleEndIndex = content.indexOf("</b>");
		if (titleEndIndex == -1 || titleEndIndex < titleStartIndex) break;

		var parsedTitle = content.substring(titleStartIndex, titleEndIndex);

		var media = {
			title: parsedTitle,
			link: parsedLink
		}

		videoLinks.push(media);

		startIndex = endIndex;
	}
} else if (url.includes("ivle.nus.edu.sg/v1/Media")) {
	// parse Multimedia
	if (source.includes("vidcast.nus")) {
		while (true) {
			startIndex = source.indexOf('<a id="ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1', startIndex);
			if (startIndex == -1) break;

			endIndex = source.indexOf("</a><br", startIndex);
			if (endIndex < startIndex) break;

			var content = source.substring(startIndex, endIndex);
			//parse link
			var linkStartIndex = content.indexOf("http://vidcast");
			if (linkStartIndex == -1) break;

			var linkEndIndex = content.indexOf("video_thumb.jpg");
			if (linkEndIndex == -1 || linkEndIndex < linkStartIndex) break;

			var parsedLink = content.substring(linkStartIndex, linkEndIndex) + 'video.mp4';

			//parse title
			content = content.substring(linkEndIndex, content.length);
			var titleStartIndex = content.indexOf("data-content=");
			titleStartIndex += ("data-content='").length;
			if (titleStartIndex == -1) break;

			var titleEndIndex = content.indexOf("href=");
			titleEndIndex -= ("' ").length;
			if (titleEndIndex == -1 || titleEndIndex < titleStartIndex) break;
			var parsedTitle = content.substring(titleStartIndex, titleEndIndex);
			var media = {
				title: parsedTitle,
				link: parsedLink
			}

			videoLinks.push(media);
			startIndex = endIndex;
		}
	} else {
		// have to traverse 1 link in
		while (true) {
			// parse traverse link
			startIndex = source.indexOf('<a data-container=', startIndex);
			if (startIndex == -1) break;

			var linkStartIndex = source.indexOf('javascript:void(winopenprompt(', startIndex);
			linkStartIndex += ('javascript:void(winopenprompt("').length;

			var linkEndIndex = source.indexOf(",", linkStartIndex);
			if (linkEndIndex == -1) break;
			linkEndIndex -= ("'").length;

			var traverseLink = "http://ivle.nus.edu.sg" + source.substring(linkStartIndex, linkEndIndex);
			traverseLink = traverseLink.replace("&amp;", "&");

			// parse title
			var titleStartIndex = source.indexOf("data-content=", startIndex);
			if (titleStartIndex == -1) break;
			titleStartIndex += ("data-content='").length;

			var titleEndIndex = source.indexOf("href=", titleStartIndex);
			if (titleEndIndex == -1) break;
			titleEndIndex -= ("' ").length;

			var parsedTitle = source.substring(titleStartIndex, titleEndIndex);

			var media = {
				title: parsedTitle,
				link: traverseLink
			}

			traverseLinks.push(media);

			startIndex += ('<a data-container=').length;
		}
	}
}

if (videoLinks.length > 0) {
	chrome.storage.local.set({'ivleVideoLinks': videoLinks});
	chrome.storage.local.set({'ivleTraverseLinks': ''});
}

if (traverseLinks.length > 0) {
	chrome.storage.local.set({'ivleTraverseLinks' : traverseLinks});
	chrome.storage.local.set({'ivleVideoLinks': ''});
}