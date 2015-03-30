var Promise = require("bluebird");
var nanoFactory = require("nano");
var winston = require("winston");

module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = ["./db"];
function factory (getDb) {
	return {
		insert: function (body) {
			return getDb().then(function (db) {
				return db.insertAsync(body);
			}).then(function (inserted) {
				return inserted[0].id;
			});
		},
	};
};
