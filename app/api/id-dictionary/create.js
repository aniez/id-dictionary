
module.exports = factory;
module.exports["@singleton"] = true;
module.exports["@require"] = ["./dbHelper"];
function factory (dbHelper) {
	return {
		action: function (req, res, next) {
			// todo save item
			dbHelper.insert(req.body).then(function (insertedId) {
				res.send(insertedId);
			}).catch(function (error) {
				res.status(400).send(error);
			});
		},
		// add descriptions
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
