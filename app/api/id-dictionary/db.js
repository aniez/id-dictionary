var Promise = require("bluebird");
var nanoFactory = require("nano");
var winston = require("winston");

module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = [];
function factory (config) {
	// !!! 'true' will pass but will not work ... todo change param
	config = config || {};
	var url = config.url || "http://localhost:3000/db/";
	var dbName = config.dbName || "idDictionaryDefaultDb";
	var nano = nanoFactory({
		url: url,
		parseUrl: false,
	});
	Promise.promisifyAll(nano);
	Promise.promisifyAll(nano.db);

	var db;
	function use (info) {
		return nano.db.use(dbName);
	}

	var initiation = nano.db.getAsync(dbName)
	.then(use)
	.catch(function (err) {
		if (err.error == "not_found") {
			// DB doesnot exist, create
			winston.info("DB does not exist, creating new one.");
			return nano.db.createAsync(dbName)
				.then(use);
		}
		throw err;
	}).then(function (database) {
		Promise.promisifyAll(database);
		db = database;
		winston.debug("DB is ready and promisified");
		return db;
	}).then(function (db) {
		// prepare views and reindex

		// but we don't need to wait for views ready
		return db;
	}).catch(function (err) {
		// really failed to create AND/OR use DB
		winston.error("Failed to create AND/OR use DB", err);
		throw err;
	});


	return function getDb() {
		if (typeof db == "undefined") {
			return initiation;
		} else {
			return new Promise(function (resolver) { resolver(db);});
		}
	}
}
