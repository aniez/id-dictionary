var express = require("express");
var router = express.Router();
var validate = require('express-jsonschema').validate;

module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = [ "./create", "./afterTestCleanup"];
function factory(create, afterTestCleanup) {
	/* GET home page. */
	router.get("/", function(req, res, next) {
		res.send({description: "Hi, there will be documentation ..."});
	});


	//router.get("/translate", translate);

	// router.get("/synonym/:id", get);
	router.post("/synonyms", validate({body: create.schema}), create.action);
	// router.patch("/synonym/:id", patch)

	router.post("/after-test-cleanup", validate({body: afterTestCleanup.schema}), afterTestCleanup.action);

	return router;

};

