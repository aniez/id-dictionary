
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
module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = ["./dbHelper"];
function factory (dbHelper) {
	return {
		action: function (req, res, next) {
				res.status(400).send({
					message: "not yet implemented",
				});
		},
	};
}



