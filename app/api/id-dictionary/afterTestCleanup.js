var _ = require("underscore");
var winston = require("winston");
var Promise = require("bluebird");

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
					requests.push(db.getAsync(_id).then(function (doc) {
						return db.destroyAsync(doc[0]._id, doc[0]._rev);
					}));
				});
				return Promise.all(requests);
			}).then(function () {
				res.send({message: "All test documents has been destroyed."});
			}).catch(function (err) {
				res.status(400).send({
					message: "Failed to destroy all documents",
					error: err // TODO security! do not send whole error to world
				});
			});
		},
		// add descriptions
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
