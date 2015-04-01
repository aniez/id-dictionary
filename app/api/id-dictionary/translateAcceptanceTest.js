var validate = require("jsonschema").validate;
var expect = require("chai").expect;
var request = require("request-promise");
var _ = require("underscore");
var Promise = require("bluebird");
// expects that config has .idDictionaryUrl
var config = require("../acceptanceTestConfig");

// to hold created document IDs
var toCleanup = [];

describe("Id dictionary", function(){
	// prepare some data to search in
	before(function (done) {
		var url = config.idDictionaryUrl + "/synonyms"
		// data which most likely will never be real production data
		var data = [
			{id: "travicka", namespaces: ["football","zelena-liga",], synonyms:["Travička","Ťřavěžďa",],},
			{id: "grassy", namespaces: ["football","green-league",], synonyms:["Grassy F.C.","FC Grassy", "Grassy"],},
		];

		var promises = _.each(data, insertMockData);
		Promise.all(promises)
			.then(function () {
				done();
			})
			.catch(function (err) {
				done(err)
			})
		;
	});

	describe("translate", function(){
		it("should return exact match", function (done) {
			var namespaces = "footbal,zelena-liga";
			var query = "Ťřavěžďa";
			var url = config.idDictionaryUrl + "/translate/" + namespaces + "/" + query;
			var options = {
				uri: url,
				method: 'GET',
			};
			request(options)
				.then(function (response) {
					expect(response.exact).to.be("travicka")
					done();
				})
				.catch(done);
		});
	});

	// remove created documents:
	//
	// TODO second use of same code, refactor
	after(function (done) {
		if (toCleanup.length < 1) {
			done();
		}
		var options = {
			uri: config.idDictionaryUrl + "/after-test-cleanup",
			method: 'POST',
			json: toCleanup,
		};
		request(options)
			.then(function (response) {
				toCleanup.length = 0;
				done();
			})
			.catch(function (err) {
				console.log("Failed to cleanup. Items:", options);
				done(err);
			})
		;
	});
});

// this method is not important, so it's out of test
function insertMockData(oneBody) {
	var url = config.idDictionaryUrl + "/synonyms"
	var options = {
		uri: url,
		method: 'POST',
		json: oneBody
	};
	var saving = request(options);
	saving
		.then(function (response) {
			expect(response).to.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
			toCleanup.push(response);
			return response;
		});
	return saving;
}
