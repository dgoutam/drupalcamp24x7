/**
 * Copyright (c) 2011 DrupalCamp24x7.org. All rights reserved.
 */

/**
 * @fileoverview Defines the constants and most commonly used functions.
 * @author dgoutam@gmail.com (Goutam Dey).
 */

/**
 * Default feed URL.
 */
var TUTORIAL_FEED_URL = 'http://drupalcamp24x7.org/tutorials/chrome/rss';
var FEATURED_FEED_URL = 'http://drupalcamp24x7.org/tutorials/featured/chrome/rss';


/**
 * Alias for getElementById.
 * @param {String} elementId Element id of the HTML element to be fetched.
 * @return {Element} Element corresponding to the element id.
 */
function $(elementId) {
  return document.getElementById(elementId);
}