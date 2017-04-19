var firstHref = $("a[href^='http']").eq(0).attr("href");
var source = document.documentElement.innerHTML;
var startIndex = 0, endIndex;
var allLinks = [];

while (true) {
	startIndex = source.indexOf('<a id="aiPodcast', startIndex);
	if (startIndex == -1) {
		break;
	}
	endIndex = source.indexOf("</b>", startIndex);
	if (endIndex < startIndex) {
		break;
	}
	endIndex += 4;
	var content = source.substring(startIndex, endIndex);

	//parse link
	var linkStartIndex = content.indexOf("http");
	if (linkStartIndex == -1) {
		break;
	}
	var linkEndIndex = content.indexOf(".mp4");
	if (linkEndIndex == -1) {
		linkEndIndex = content.indexOf(".mp3");
	}
	if (linkEndIndex == -1 || linkEndIndex < linkStartIndex) {
		break;
	}
	linkEndIndex += 4;
	var parsedLink = content.substring(linkStartIndex, linkEndIndex);
	parsedLink = parsedLink.replace("/StreamInBrowser/", "/Stream/");
	parsedLink = parsedLink.replace(".mp3", ".mp4");

	//parse title
	var titleStartIndex = content.indexOf("<b>");
	titleStartIndex += 3;
	var titleEndIndex = content.indexOf("</b>");

	var parsedTitle = content.substring(titleStartIndex, titleEndIndex);

	var media = {
		title: parsedTitle,
		link: parsedLink
	}

	allLinks.push(media);

	startIndex = endIndex;
}

chrome.storage.local.set({'videoLinks': allLinks}, function() {
});