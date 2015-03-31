var assert = require("assert"); // core module
var createFactory = require("./create");
var validate = require("jsonschema").validate;
var sinon = require("sinon");
var expect = require("chai").expect;
var Promise = require("bluebird");

// presenter / controller tests are painfull ... TODO search for some express-test package
describe("Id dictionary", function(){
	describe("create synonyms", function(){
		describe("action", function(){
			var create = null;
			var dbInterface ;
			var dbMock;

			beforeEach(function(){
				dbInterface = {insert: function () {}};
				dbMock = sinon.mock(dbInterface);
				create = createFactory(dbInterface);
			});

			it("should insert request.body to DB and return new _id", function(done){
				var req = {
					body: {name: "mocked body"},
				};
				var res = {
					send: function (id) {
						var err;
						if (id !== "mockId") {
							err = "unexpected body to send: " + id;
						}
						done(err);
					}
				};
				var mockPromise = new Promise(function (resolve, reject) {
					resolve("mockId");
				});
				dbMock.expects("insert").once().returns(mockPromise);

				create.action(req, res);

				dbMock.verify();
			});

			it("should change status to 400 and send errormessage on error during insert", function(done){
				var req = {
					body: {name: "mocked body"},
				};
				var res = {
					status: function (status) {
						expect(status).to.equal(400);
						return res;
					},
					send: function (body) {
						var err;
						if (body !== "error description") {
							err = "unexpected body to send: " + body;
						}
						done(err);
					}
				};
				var rejection;
				var mockPromise = new Promise(function (resolve, reject) {
					rejection = reject;
				});
				dbMock.expects("insert").once().returns(mockPromise);

				create.action(req, res);
				rejection("error description");

				dbMock.verify();
			});
		});

		describe("schema", function(){
			var create = null;
			beforeEach(function(){
				create = createFactory();
			});
			it("should accept right object", function(){
				var rightRequest = {
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

				var result = validate(rightRequest, create.schema);

				if (result.errors.length > 0) {
					throw new Error("Validation failed: " + result.errors.toString());
				}
			});
		});
	});
});