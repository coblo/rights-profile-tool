document.addEventListener('DOMContentLoaded', function() {

	document.querySelector('#validate').addEventListener('click', function() {

		var code = JSON.parse(document.querySelector('#rpc').value);

		console.log(code);

	});
	narf = new Ajv({allErrors: true});

	var data = {
		"sublicense": false,
		"assign": true,
		"specificUserGroup": true,
		"generalPublic": false,
		"commercialInstitutionalRights__selected": {
			"reproduce": false,
			"distributePhysicalCopy": true,
			"availableForStreaming": false,
			"availableForDownloading": false,
			"lease": false,
			"lend": false,
			"advertise": true,
			"derive": false
		},
		"commercialInstitutionalRights": true,
		"privateUsageRights": true,
		"privateUsageRights__selected": {
			"reproduce":true,
			"socialSharing":false,
			"derive":true,
			"resale":true
		},
		"usageRightsRestricted": true,
		"exclusiveRights": false,
		"territoriallyRestricted": true,
		"temporarilyRestricted": true,
		"originalCreator": true,
		"publisherExploiter": false
	};

	var schema = {
		additionalProperties: false,
		"title": "rightsProfile",
		"type": "object",
		"properties": {
			"sublicense": { "type": "boolean" },
			"assign": { "type": "boolean" },
			"specificUserGroup": { "type": "boolean" },
			"generalPublic": { "type": "boolean" },
			"commercialInstitutionalRights": { "type": "boolean" },
			"commercialInstitutionalRights__selected": {
				"reproduce": { "type": "boolean" },
				"distributePhysicalCopy": { "type": "boolean" },
				"availableForStreaming": { "type": "boolean" },
				"availableForDownloading": { "type": "boolean" },
				"lease": { "type": "boolean" },
				"lend": { "type": "boolean" },
				"advertise": { "type": "boolean" },
				"derive": { "type": "boolean" }
			},
			"privateUsageRights": {"type": "boolean"},
			"privateUsageRights__selected":{
				"reproduce": { "type": "boolean"},
				"socialSharing": { "type": "boolean"},
				"derive": { "type": "boolean"},
				"resale": {"type": "boolean"}
			},
			"usageRightsRestricted": { "type": "boolean" },
			"exclusiveRights": { "type": "boolean" },
			"territoriallyRestricted": { "type": "boolean" },
			"temporarilyRestricted": { "type": "boolean" },
			"originalCreator": { "type": "boolean" },
			"publisherExploiter": { "type": "boolean" }
		},
		"required": [
			'originalCreator',
			'publisherExploiter',
			'temporarilyRestricted',
			'territoriallyRestricted',
			'usageRightsRestricted',
			'exclusiveRights'
		],
		"allOf": [
			{"$ref": "privateUsageRights"}
		]
	};
	var privateUsageRights = {
		"$schema": "http://json-schema.org/draft-06/schema#",
		"$id": "privateUsageRights",
		"title": "privateUsageRights",
		"type": "object",
		"oneOf": [
			{
				"properties": {
					"privateUsageRights": {
						"enum": [true]
					},
					"privateUsageRights__selected":{
						"type": "object",
						"oneOf": [
							{
								"properties": {
									"reproduce": {"enum": [true]},
									"socialSharing": {"enum": [true, false]},
									"derive": {"enum": [true, false]},
									"resale": {"enum": [true, false]}
								}
							},
							{
								"properties": {
									"reproduce": {"enum": [false]},
									"socialSharing": {"enum": [false]},
									"derive": {"enum": [false]},
									"resale": {"enum": [true, false]}
								}
							}
						],
						"required": ["reproduce", "socialSharing", "derive", "resale"]
					}
				},
				"required": ["privateUsageRights","privateUsageRights__selected"]
			},
			{
				"properties": {
					"privateUsageRights": {
						"enum": [false]
					}
				},
				"required":["privateUsageRights"]
			}
		]
	};
	narf.addSchema(privateUsageRights);
	var asd = narf.validate(schema, data);
	console.log(narf.errors);

});
