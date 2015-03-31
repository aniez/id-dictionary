
// Create Synonym
// ----------------
// creates synonym and save it into DB
//
// with defalt router:
//```bash
//	curl --include \
//		--request POST \
//		--header "Content-Type: application/json" \
//		--data-binary '{
//			"id": "sparta",
//			"namespaces": [
//				"football",
//				"1-czech-league",
//			],
//			"synonyms": [
//	    		"AC Sparta Praha",
//				"AC Sparta",
//				"Sparta"
//			],
//		}' \
//     'http://ID_DICTIONARY_PATH/synonyms'
//```
module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = ["./dbHelper"];
function factory (dbHelper) {
	return {
		action: function (req, res, next) {
			dbHelper.insert(req.body).then(function (insertedId) {
				res.send(insertedId);
			}).catch(function (error) {
				res.status(400).send(error);
			});
		},

		// <a name="SynonymSchema"></a>Synonym schema:
		//```json
		//	{
		//		"id": "liverpool",
		//		"namespaces": [
		//			"football",
		//			"england-premier-league"
		//		],
		//		"synonyms": [
		//			"Liverpool FC",
		//			"Liverpool F.C.",
		//			"Liverpool",
		//			"FC Liverpool",
		//		]
		//	}
		//```
		schema: {
			type: 'object',
			properties: {
				id: {
					type: "string",
					required: true,
				},
				namespaces: {
					type: "array",
					required: true,
					items: {
						type: "string",
					},
					minItems: 2,
				},
				synonyms: {
					type: "array",
					required: true,
					items: {
						type: "string",
					},
					minItems: 1,
				},
			},
		},
	};
}



