var Promise = require("bluebird");
var nanoFactory = require("nano");
var winston = require("winston");

// DB Helper
// ---------
//
// Operations over DB
module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = ["./db"];
function factory (getDb) {
	return {
		// Insert [Synonym](create.html#SynonymSchema) and returns its _id
		insert: function (body) {
			return getDb().then(function (db) {
				return db.insertAsync(body);
			}).then(function (inserted) {
				return inserted[0].id;
			});
		},
	};
};
