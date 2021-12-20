/**
 * https://github.com/wikimedia/html-metadata
 *
 * This file wraps all exportable functions so that they
 */

'use strict';

/*
Import modules
 */
var cheerio = require('cheerio');
var request = require('request-promise'); // Promisified Request library
var fs = require('fs').promises;

var index = require('./lib/index.js');

/**
 * Default exported function that takes a url string or
 * request library options object and returns a
 * all available metadata
 *
 * @param  {Object}   urlOrOpts  url String or options Object
 * @return {Object}              metadata
 */
exports = module.exports = function(urlOrOpts) {
	return request.get(urlOrOpts
	).then(function(response) {
		return index.parseAll(cheerio.load(response));
	});
};

/**
 * Exported function that takes html file and
 * returns a all available metadata
 *
 * @param  {String}   path  	 path Path to HTML file
 * @param  {Object}   [opts]  	 opts Additional options such as encoding
 * @return {Object}              metadata
 */
exports.loadFromFile = function(path, opts) {
	var defaultEncoding = 'utf-8';

	return fs.readFile(path, opts).then(html =>
		index.parseAll(cheerio.load(html))
	);
};

/**
 * Exported function that takes html string and
 * returns a all available metadata
 *
 * @param  {String}   html  	 html String HTML of the page
 * @return {Object}              metadata
 */
exports.loadFromString = function(html) {
	return index.parseAll(cheerio.load(html));
};

/**
 * Returns Object containing all available datatypes, keyed
 * using the same keys as in metadataFunctions.
 *
 * @param  {Object}   chtml      html Cheerio object to parse
 * @return {Object}              metadata
 */
exports.parseAll = function(chtml){
	return index.parseAll(chtml);
};

/**
 * Scrapes BE Press metadata given html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseBEPress = function(chtml){
	return index.parseBEPress(chtml);
};

/**
 * Scrapes embedded COinS data given Cheerio loaded html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseCOinS = function(chtml){
	return index.parseCOinS(chtml);
};

/**
 * Parses value of COinS title tag
 *
 * @param  {String}   title      String corresponding to value of title tag in span element
 * @return {Object}              metadata
 */
exports.parseCOinSTitle = function(title){
	return index.parseCOinSTitle(title);
};

/**
 * Scrapes Dublin Core data given Cheerio loaded html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseDublinCore = function(chtml){
	return index.parseDublinCore(chtml);
};

/**
 * Scrapes EPrints data given Cheerio loaded html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseEprints = function(chtml){
	return index.parseEprints(chtml);
};

/**
 * Scrapes general metadata terms given Cheerio loaded html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseGeneral = function(chtml){
	return index.parseGeneral(chtml);
};

/**
 * Scrapes Highwire Press metadata given html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseHighwirePress = function(chtml){
	return index.parseHighwirePress(chtml);
};

/**
 * Retrieves JSON-LD for given html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              JSON-LD
 */
exports.parseJsonLd = function(chtml){
	return index.parseJsonLd(chtml);
};

/**
 * Scrapes OpenGraph data given html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseOpenGraph = function(chtml){
	return index.parseOpenGraph(chtml);
};

/**
 * Scrapes schema.org microdata given Cheerio loaded html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseSchemaOrgMicrodata = function(chtml){
	return index.parseSchemaOrgMicrodata(chtml);
};

/**
 * Scrapes Twitter data given html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parseTwitter = function(chtml){
	return index.parseTwitter(chtml);
};

/**
 * Scrapes PRISM data given html object
 *
 * @param  {Object}   chtml      html Cheerio object
 * @return {Object}              metadata
 */
exports.parsePrism = function(chtml){
	return index.parsePrism(chtml);
};

/**
 * Global exportable list of scraping promises with string keys
 * @type {Object}
 */
exports.metadataFunctions = index.metadataFunctions;

/*
  Export the version
*/

exports.version = require('./package').version;
