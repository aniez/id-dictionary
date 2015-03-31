var _ = require("underscore");
var winston = require("winston");
var Promise = require("bluebird");

// AfterTestCleanup
// ----------------
// destroys documents created during tests
//
// with defalt router:
//```bash
//	curl --include \
//		--request POST \
//		--header "Content-Type: application/json" \
//		--data-binary '["documentId", ...]' \
//		'http://ID_DICTIONARY_PATH/after-test-cleanup'
//```
module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = ["./db"];
function factory (database) {
	return {
		action: function (req, res, next) {
			console.log("in Action");
			database().then(function (db) {
				Promise.promisifyAll(db);
				var ids = req.body;
				var requests = [];

				_.each(ids, function (_id) {
					var request = db
					.getAsync(_id)
					.then(function (doc) {
						var _id = doc[0]._id;
						var _rev = doc[0]._rev
						// TODO check id and rev have expected format, when they are empty, it destroys whole database!!!
						return db.destroyAsync(_id, _rev);
					});
					requests.push(request);
				});
				return Promise.all(requests);
			}).then(function () {
				res.send({
					message: "All test documents has been destroyed."
				});
			}).catch(function (err) {
				res.status(400).send({
					message: "Failed to destroy all documents",
					// TODO security! do not send whole error to world
					error: err
				});
			});
		},
		schema: {
			type: "array",
			required: true,
			items: {
				type: "string",
			},
			minItems: 1,
		},
	};
}
