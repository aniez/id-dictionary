var validate = require("jsonschema").validate;
var expect = require("chai").expect;
var request = require("request-promise");
// expects that config has .idDictionaryUrl
var config = require("../acceptanceTestConfig");

describe("Id dictionary", function(){
	// to hold created document IDs
	var toCleanup = [];
	describe("create synonym", function(){
		it("should accept synonyms", function (done) {
			var url = config.idDictionaryUrl + "/synonyms"
			var sparta = {
				id: "sparta",
				namespaces: [
					"football",
					"1-czech-league",
				],
				synonyms:[
					"AC Sparta Praha",
					"AC Sparta",
					"Sparta"
				],
			};
			var options = {
				uri: url,
				method: 'POST',
				json: sparta
			};
			request(options)
				.then(function (response) {
					expect(response).to.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
					toCleanup.push(response);
					done();
				})
				.catch(function (err) {
					done(err);
				})
			;
		});

		it("should reject malformed synonym", function (done) {
			var url = config.idDictionaryUrl + "/synonyms"
			var sparta = {
				// Removed id: "sparta",
				namespaces: [
					"football",
					"1-czech-league",
				],
				synonyms:[
					"AC Sparta Praha",
					"AC Sparta",
					"Sparta"
				],
			};
			var options = {
				uri: url,
				method: 'POST',
				json: sparta
			};
			request(options)
				.then(function (response) {
					toCleanup.push(response);
					done(new Error("This request should fail", response));
				})
				.catch(function (err) {
					done();
				})
			;
		});
	});

	// remove created documents:
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