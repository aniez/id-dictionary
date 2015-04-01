
// Translate
// ----------------
// try to translate to ID
//
// with defalt router:
//```bash
//	curl --include \
//		--request GET \
//		--header "Content-Type: application/json" \
//     'http://ID_DICTIONARY_PATH/translate/footbal,england-premier-league/Liverpool F.C.'
//```
//
// For query "Sparta" with "footbal,1-czech-league" result will be something like
//
//```javascript
//	// if there is exact record
//	{
//		"exact": "sparta-fc"
//	}
//	// or if there is no exact match,
//	// but there are some records without namespaces match
//	{
//		"exact: null
//		"bestEffort": [
//			"sparta-hc",
//			"sparta-sc",
//		]
//	}
//```

module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = ["./repository"];
function factory (repository) {
	return {
		action: function (req, res, next) {
			var namespaces = req.params.namespaces.split(",");
			var query = req.params.query;
			repository.translate(namespaces, query)
				.then(res.send)
				.catch(function (err) {
					res
						.status(400)
						.send(err);
				})
			;
		},
	};
}



