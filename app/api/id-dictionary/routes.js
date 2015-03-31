// Factory for router of id-dictionary package
// -------------------------------------------
var express = require("express");
var router = express.Router();
var validate = require('express-jsonschema').validate;

module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = [ "./create", "./afterTestCleanup"];
function factory(create, afterTestCleanup) {
	router.get("/", function(req, res, next) {
		res.send({description: "Hi, there will be documentation ..."});
	});

	router.post(
		"/synonyms",
		validate({
			body: create.schema
		}),
		create.action
	);
	router.post(
		"/after-test-cleanup",
		validate({
			body: afterTestCleanup.schema
		}),
		afterTestCleanup.action
	);
	// TODO:
	//```javascript
	// router.patch("/synonym/:id", patch)
	// router.get("/synonym/:id", get);
	// router.get("/translate/:namespaces/:query", translate);
	//```

	return router;
};
