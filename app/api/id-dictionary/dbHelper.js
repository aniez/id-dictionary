var Promise = require("bluebird");
var nanoFactory = require("nano");
var winston = require("winston");


// Couch DB Helper
// ---------------
//
// Privides DB and Views
//
// DB factory:
// - get info about DB
// - if DB does not exists, try to create and then use it
// - there is place for initiation of indexes and views
//
//
// Example (params in example are defaults):
//```javascript
//	var dbHelper = factory({
//		url: "http://localhost:3000/db/",
//		dbName: "idDictionaryDefaultDb",
//	});
//
//	dbHelper.getDb().then(functino (db) {
//		// db is instanceof nano
//		...
//	});
//
//	dbHelper.getTranslateView().then(functino (view) {
//		// db is instanceof nano.view
//		...
//	});
//
//```
module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = [];
function factory (config) {
	// TODO? 'true' as config param will pass but will not work
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
			if (err.error === "not_found") {
				winston.info("DB does not exist, creating new one.");
				return nano.db.createAsync(dbName)
					.then(use);
			}
			throw err;
		})
		.then(function (database) {
			Promise.promisifyAll(database);
			db = database;
			winston.debug("DB is ready and promisified");
			return db;
		})
		.then(function (db) {
			// TODO prepare views and reindex

			// but we don't need to wait for views to be ready, so return previous promise
			return db;
		})
		.catch(function (err) {
			winston.error("Failed to create AND/OR use DB", err);
			// Throws error
			// - when failed to get info about DB with different reason than 'not_found'.
			//   TODO probably detection should be improved. Simple 404 from ANY server does mean 'not_found'
			// - when failed to create DB
			throw err;
		})
	;
	return {
		getDb: 	function () {
			// maybe just return initiation, but I don't know if
			// it is save to call thousand times .then() of one object
			if (typeof db === "undefined") {
				return initiation;
			} else {
				return new Promise(function (resolve) { resolve(db);});
			}
		},

		getTranslateView: function () {
			return new Promise(function (resolve, reject) {
				reject("NotImplemented yet");
			});
		}
	}
}
