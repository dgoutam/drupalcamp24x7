/**
 * Copyright (c) 2011 DrupalCamp24x7.org. All rights reserved.
 */

/**
 * @fileoverview This file retrieves feeds and shows in pop-up
 * page.
 * @author dgoutam@gmail.com (Goutam Dey).
 */

// Store value retrieved from locale.
var moreStoriesLocale = chrome.i18n.getMessage('more_stories') + ' \u00BB ';

// Feed URL.
var feedUrl = TUTORIAL_FEED_URL;
var featuredFeedUrl = FEATURED_FEED_URL;

//The XMLHttpRequest object that tries to load and parse the feed.
var reqFeed;
var reqFeaturedFeed;


/**
 * Sends request to drupalcamp24x7 server
 */
function main() { 
  requestFeed();
  requestFeaturedFeed();
}

function requestFeed(){
  req = new XMLHttpRequest();
  req.onload = handleResponse;
  req.onerror = handleError;
  req.open('GET', feedUrl, true);
  req.send(null);
}

function requestFeaturedFeed(){
  reqFeaturedFeed = new XMLHttpRequest();
  reqFeaturedFeed.onload = handleResponseFeatured;
  reqFeaturedFeed.onerror = handleError;
  reqFeaturedFeed.open('GET', featuredFeedUrl, true);
  reqFeaturedFeed.send(null);
}
/**
 * Handles feed parsing errors.
 * @param {String} error The localized error message.
 */
function handleFeedParsingFailed(error) {
  var feed = $('feed');
  $('noStories').style.display = 'none';
  feed.className = 'error';
  feed.innerText = error;
}

/**
 * Handles errors during the XMLHttpRequest.
 */
function handleError() {
  handleFeedParsingFailed(chrome.i18n.getMessage('fetchError'));
}

/**
 * Parses the tutorial feed response.
 */
function handleResponse() {
  var doc = req.responseXML;
  if (!doc) {
    document.querySelector('body').style.minHeight = 0;
    return;
  }
  var target='feed';
  buildFeedItems(doc,target);
}

/**
 * Parses the featured feed response.
 */
function handleResponseFeatured() {
  var doc = reqFeaturedFeed.responseXML;
  if (!doc) {
    document.querySelector('body').style.minHeight = 0;
    return;
  }
  var target='featuredfeed';
  buildFeedItems(doc,target);
  target.className='hide';
}


// Stores no. of stories selected in options page.
var maxFeedItems = 5;

// Where the more stories link should navigate to.
var moreStoriesUrl;

/**
* Build link items.
*/
function buildFeedItems(doc,target){
  var link = doc.querySelector('link');
  var parentTag = link.parentNode.tagName;
  if (parentTag != 'item' && parentTag != 'entry') {
    moreStoriesUrl = link.textContent;
  }
  var feed = $(target);
  feed.className = '';
  var entries = doc.getElementsByTagName('entry');
  if (entries.length == 0) {
    entries = doc.getElementsByTagName('item');
  }
  var count = Math.min(entries.length, maxFeedItems);
	for (var i = 0; i < count; i++) {
		item = entries.item(i);

		// Grab the title for the feed item.
		var itemTitle = item.querySelector('title');
		if (itemTitle) {
		  itemTitle = itemTitle.textContent;
		} else {
		  itemTitle = 'Unknown title';
		}

		// Grab the description.
		var itemDesc = item.querySelector('description');
		if (!itemDesc) {
		  itemDesc = item.querySelector('summary');
		  if (!itemDesc) {
			itemDesc = item.querySelector('content');
		  }
		}
		if (itemDesc) {
		  itemDesc = itemDesc.childNodes[0].nodeValue;

		} else {
		  itemDesc = '';
		}
		var itemLink = item.querySelector('link');
		if (itemLink) {
		  itemLink = itemLink.textContent;
		} else {
		  itemLink = 'Unknown itemLink';
		}
		
		var item = document.createElement('div');
		item.className = 'item';
		var box = document.createElement('div');
		box.className = 'open_box';
		//box.addEventListener('click', showDesc);
		item.appendChild(box);

		var title = document.createElement('a');
		title.className = 'item_title';
		title.innerText = itemTitle;
		
		title.href = 'javascript:chrome.tabs.create({"url":"'+itemLink+'", "selected":true});window.close();';
		item.appendChild(title);
		feed.appendChild(item);

  } //End for
}



function showFeed(){	
	var feed = $('feed');
	var featured = $('featuredfeed');
	var linkFeatured = $('link-featured');
	var linkLatest = $('link-latest');

	feed.className = 'show';
	featuredfeed.className = 'hide';
	featuredfeed.style.display = 'none';

	linkLatest.className = 'active';
	linkFeatured.className = 'normal';
	
}

function showFeatured(){
	var feed = $('feed');
	var featured = $('featuredfeed');
	var linkFeatured = $('link-featured');
	var linkLatest = $('link-latest');

	feed.className = 'hide';
	featuredfeed.className = 'show';
	featuredfeed.style.display = 'block';
	linkFeatured.className = 'active';
	linkLatest.className = 'normal';
}




/**
 * Show |url| in a new tab.
 * @param {String} url The news URL.
 */
function showUrl(url) {
  // Only allow http and https URLs.
  if (url.indexOf('http:') != 0 && url.indexOf('https:') != 0) {
    return;
  }
  chrome.tabs.create({url: url});
}

/**
 * Redirects to Google news site for more stories.
 * @param {Object} event Onclick event.
 */
function moreStories(event) {
  showUrl(moreStoriesUrl);
}

