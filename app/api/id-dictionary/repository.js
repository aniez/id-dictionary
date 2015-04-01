var Promise = require("bluebird");
var nanoFactory = require("nano");
var winston = require("winston");

// DB Helper
// ---------
//
// Operations over DB
module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = ["./dbHelper"];
function factory (dbHelper) {
	return {
		// Insert [Synonym](create.html#SynonymSchema) and returns its _id
		insert: function (body) {
			return dbHelper.getDb()
				.then(function (db) {
					return db.insertAsync(body);
				})
				.then(function (inserted) {
					return inserted[0].id;
				})
			;
		},

		translate: function (namespaces, query) {
			return dbHelper.getTranslateView();
			// TODO work with view, namespaces and query
			/*
				.then(function (view) {
					console.log("hey view, ", view);
				})
			;
			*/
		},
	};
};
