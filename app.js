var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var PouchDB = require("pouchdb");
var ioc = require("electrolyte");
var expressWinston = require("express-winston");
var winston = require("winston");
winston.level = "debug";

ioc.loader(ioc.node("app"));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hjs");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressWinston.errorLogger({
	transports: [
		new winston.transports.Console({
			json: true,
			colorize: true
		})
	]
}));

var pouchdb = require("express-pouchdb")(PouchDB, {
	mode: "fullCouchDB",
});

app.use("/db", pouchdb);

app.use("/api/id-dictionary", ioc.create("api/id-dictionary/routes"));

/*
app.use("/", function(req, res, next) {
	res.render("index", { title: "in main app" });
});
*/
// workaround to make FAUXTON work
if (app.get("env") === "development") {
	app.use("/", pouchdb);
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handlers
// JSON validation error
app.use(function(err, req, res, next) {
	var responseData;
	if (err.name === "JsonSchemaValidation") {
		winston.error(err.message);
		res.status(400);
		responseData = {
			statusText: "Bad Request",
			jsonSchemaValidation: true,
			validations: err.validations
		};
		res.json(responseData);
	} else {
		next(err);
	}
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render("error", {
		message: err.message,
		error: {}
	});
});


module.exports = app;
