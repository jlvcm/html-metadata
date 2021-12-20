'use strict';

/**
 * Tests expecting promises to reject
 */

var cheerio = require('cheerio');
var meta = require('../index');
var request = require('request-promise'); // Promisified Request library
var assert = require('./utils/assert.js');
var fs = require('fs');


// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */


describe('errors', function() {

	this.timeout(40000);

	it('should not find schema.org metadata, reject promise', function() {
		var url = 'http://example.com';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseSchemaOrgMicrodata($);
		}));
	});

	it('should not find BE Press metadata, reject promise', function() {
		var url = 'http://example.com';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseBEPress($);
		}));
	});

	it('should not find coins metadata, reject promise', function() {
		var url = 'http://example.com';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseCOinS($);
		}));
	});

	it('should not find dublin core metadata, reject promise', function() {
		var url = 'http://www.laprovence.com/article/actualites/3411272/marseille-un-proche-du-milieu-corse-abattu-par-balles-en-plein-jour.html';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseDublinCore($);
		}));
	});

	it('should not find highwire press metadata, reject promise', function() {
		var url = 'http://example.com';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseHighwirePress($);
		}));
	});

	it('should not find open graph metadata, reject promise', function() {
		var url = 'http://www.example.com';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseOpenGraph($);
		}));
	});

	it('should not find eprints metadata, reject promise', function() {
		var url = 'http://example.com';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseEprints($);
		}));
	});

	it('should not find twitter metadata, reject promise', function() {
		var url = 'http://example.com';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseTwitter($);
		}));
	});

	it('should not find JSON-LD, reject promise', function() {
		var url = 'http://example.com';
		return assert.fails(request.get(url)
		.then(function(callRes) {
			var $ = cheerio.load(callRes);
			return meta.parseJsonLd($);
		}));
	});

	it('should reject parseALL promise for entire error file', function() {
		var $ = cheerio.load(fs.readFileSync('./test/static/turtle_article_errors.html'));
		return assert.fails(Promise.resolve().then(()=> meta.parseAll($)));
	});


	it('should reject promise with undefined cheerio object', function() {
		return assert.fails(Promise.resolve().then(()=> meta.parseOpenGraph(undefined)));
	});

	it('should reject promise with non-string title', function() {
		return assert.fails(Promise.resolve().then(()=> meta.parseCOinSTitle({})));
	});

	it('should reject promise with string with no keys', function() {
		return assert.fails(Promise.resolve().then(()=> meta.parseCOinSTitle('')));
	});

	it('should reject promise with string with bad keys', function() {
		return assert.fails(Promise.resolve().then(()=> meta.parseCOinSTitle('badkey.a&badkey.b')));
	});

});
