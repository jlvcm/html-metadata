'use strict';

/**
 * Tests using externally scraped websites. May fail if resource at
 * location changes.
 */

var meta = require('../index');
var assert = require('./utils/assert.js');
var request = require('request-promise');
var cheerio = require('cheerio');

// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */

describe('scraping', function() {

	this.timeout(50000);

	var url;

	describe('parseAll function', function() {
		describe('Resolve parseAll promises for partial metadata', function() {
			it('should resolve promise from woorank', function() {
				var opts = {
					uri: 'https://www.woorank.com/en/blog/dublin-core-metadata-for-seo-and-usability',
					headers: {
                    	'User-Agent': 'html-metadata'
					}
				};
				return meta(opts)
			});

			it('should resolve promise from blog.schema.org', function() {
				url = 'http://blog.schema.org';
				return meta(url);
			});
		});
	});

	describe('parseBEPress function', function() {
		it('should get BE Press metadata tags', function() {
			url = 'http://biostats.bepress.com/harvardbiostat/paper154/';
			return request.get(url).then(function(callRes) {
				var expectedAuthors = ['Claggett, Brian', 'Xie, Minge', 'Tian, Lu'];
				var expectedAuthorInstitutions = ['Harvard', 'Rutgers University - New Brunswick/Piscataway', 'Stanford University School of Medicine'];
				var chtml = cheerio.load(callRes);
				const results = meta.parseBEPress(chtml);
				var authors = results.author;
				var authorInstitutions = results.author_institution;
				assert.deepEqual(authors, expectedAuthors);
				assert.deepEqual(authorInstitutions, expectedAuthorInstitutions);
				['series_title', 'author', 'author_institution', 'title', 'date', 'pdf_url',
					'abstract_html_url', 'publisher', 'online_date'].forEach(function(key) {
					if(!results[key]) {
						throw new Error('Expected to find the ' + key + ' key in the response!');
					}
				});
			});
		});
	});

	describe('parseCOinS function', function() {
		it('should get COinS metadata', function() {
			url = 'https://en.wikipedia.org/wiki/Viral_phylodynamics';
			return request.get(url).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				const results = meta.parseCOinS(chtml)
				console.log(results);
				assert.deepEqual(Array.isArray(results), true, 'Expected Array, got' + typeof results);
				assert.deepEqual(!results.length, false, 'Expected Array with at least 1 item');
				assert.deepEqual(!results[0].rft, false, 'Expected first item of Array to contain key rft');
			});
		});
	});

	describe('parseEPrints function', function() {
		it('should get EPrints metadata', function() {
			url = 'http://eprints.gla.ac.uk/113711/';
			return request.get(url).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				var expectedAuthors = ['Gatherer, Derek', 'Kohl, Alain'];

				const results = meta.parseEprints(chtml)
				assert.deepEqual(results.creators_name, expectedAuthors); // Compare authors values
				// Ensure all keys are in response
				['eprintid', 'datestamp', 'title', 'abstract', 'issn', 'creators_name', 'publication', 'citation'].forEach(function(key) {
					if(!results[key]) {
						throw new Error('Expected to find the ' + key + ' key in the response!');
					}
				});
			});
		});
	});

	describe('parseGeneral function', function() {
		it('should get html lang parameter', function() {
			var expected = "fr";
			var options =  {
				url: "http://www.lemonde.fr",
				headers: {
					'User-Agent': 'webscraper'
				}
			};
			return request.get(options).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				const results = meta.parseGeneral(chtml)
				assert.deepEqual(results.lang, expected);
			});
		});

		it('should get html dir parameter', function() {
			var expected = "rtl";
			var options =  {
				url: "https://www.iranrights.org/fa/",
				headers: {
					'User-Agent': 'webscraper'
				}
			};
			return request.get(options).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				const results = meta.parseGeneral(chtml)
				assert.deepEqual(results.dir, expected);
			});
		});
	});

	describe('parseHighwirePress function', function() {
		it('should get Highwire Press metadata', function() {
			url = 'http://mic.microbiologyresearch.org/content/journal/micro/10.1099/mic.0.26954-0';
			return request.get(url).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				var expectedAuthors = ['Jacqueline M. Reimers', 'Karen H. Schmidt', 'Angelika Longacre', 'Dennis K. Reschke', 'Barbara E. Wright'];

				const results = meta.parseHighwirePress(chtml);
				assert.deepEqual(results.author, expectedAuthors); // Compare authors values
				// Ensure all keys are in response
				['journal_title', 'issn', 'doi', 'publication_date', 'title', 'author', 'author_institution',
					'volume', 'issue', 'firstpage', 'lastpage', 'publisher', 'abstract'].forEach(function(key) {
					if(!results[key]) {
						throw new Error('Expected to find the ' + key + ' key in the response!');
					}
				});
			});
		});
	});

	describe('parseOpenGraph function', function() {
		it('from http://fortune.com', function() {
			url = 'http://fortune.com/2015/02/20/nobel-prize-economics-for-sale/';
			return request.get(url).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				const results = meta.parseOpenGraph(chtml);
				['title', 'description'].forEach(function(key) {
					if(!results.hasOwnProperty(key)) {
						throw new Error('Expected to find the ' + key + ' key in the response!');
					}
				});
			});
		});

		it('image tag urls and metadata from http://github.com', function() {
			url = 'https://github.com';
			return request.get(url).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				const results = meta.parseOpenGraph(chtml);
				['url', 'type', 'width', 'height'].forEach(function(key) {
					if(!results.image.hasOwnProperty(key)) {
						throw new Error('Expected to find the ' + key + ' key in the response!');
					}
				});
			});
		});

	});

	describe('parseSchemaOrgMicrodata function', function() {
		it('should get Schema.org Microdata', function() {
			url = 'http://blog.schema.org/';
			return request.get(url).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				const results = meta.parseSchemaOrgMicrodata(chtml);
				if(!results.items) {
					throw new Error('Expected to find items in the response!');
				}
			});
		});
	});

	describe('parseTwitter function', function() {
		it('from https://github.com/wikimedia/html-metadata', function() {
			url = 'https://github.com/wikimedia/html-metadata';
			return request.get(url).then(function(callRes) {
				var chtml = cheerio.load(callRes);
				const results = meta.parseTwitter(chtml);
				['card', 'site', 'description', 'title', 'image'].forEach(function(key) {
					if(!results[key]) {
						throw new Error('Expected to find the ' + key + ' key in the response!');
					}
				});
			});
		});

		it('and nested Twitter data from www.theguardian.com',async function() {
			url = 'http://www.theguardian.com/us';
			const results = await meta(url);
			console.log(results.twitter);
				var expected = '{"app":{"id":{"iphone":"409128287","ipad":"409128287","googleplay":"com.guardian"},"name":{"googleplay":"The Guardian","ipad":"The Guardian","iphone":"The Guardian"},"url":{"ipad":"gnmguardian://us?contenttype=front&source=twitter","iphone":"gnmguardian://us?contenttype=front&source=twitter"}},"site":"@guardian","card":"summary","dnt":"on","url":"https://www.theguardian.com/us"}';
				assert.deepEqual(JSON.stringify(results.twitter), expected);
		});
	});

	describe('parseJsonLd function', function() {
		var urls = ['http://www.theguardian.com/us', 'http://www.apple.com/'];
		urls.forEach(function(test) {
			describe(test, function() {
				it('should return an object or array and get correct data', function() {
					return request.get(test).then(function(callRes) {
						var chtml = cheerio.load(callRes);
						const results = meta.parseJsonLd(chtml);
						assert.ok(typeof results === 'object');
						var result = results.filter(function(r) {
							return r['@type'] === 'Organization';
						})[0]; // Check the first organisation for the correct properties
						['@context', '@type', 'url', 'logo'].forEach(function(key) {
							assert.ok(result.hasOwnProperty(key));
						});
					});
				});
			});
		});
	});

	describe('parsePrism function', function() {
		it('should get PRISM metadata from http://nature.com', function() {
			url = 'https://www.nature.com/articles/nature24679';
			return request.get(url).then(function(callRes) {
				var expectedKeys = ['issn', 'publicationName', 'publicationDate', 'section', 'copyright', 'rightsAgent', 'url', 'doi'];
				var chtml = cheerio.load(callRes);

				const results = meta.parsePrism(chtml);
				expectedKeys.forEach(function(key) {
					if(!results.hasOwnProperty(key)) {
						throw new Error('Expected to find the ' + key + ' key in the response!');
					}
				});
			});
		});
	});

	it('should not have any undefined values', function() {
		url = 'https://www.cnet.com/special-reports/vr101/';
		return request.get(url).then(function(callRes) {
			var chtml = cheerio.load(callRes);
			const results = meta.parseAll(chtml);
			Object.keys(results).forEach(function(metadataType) {
				Object.keys(results[metadataType]).forEach(function(key) {
					assert.notDeepEqual(results[metadataType][key], undefined); // Ensure all values are not undefined in response
				});
			});
		});
	});

});
