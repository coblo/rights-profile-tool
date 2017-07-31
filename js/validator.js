document.addEventListener('DOMContentLoaded', function() {

	document.querySelector('#validate').addEventListener('click', function() {

		var code = JSON.parse(document.querySelector('#rpc').value);

		console.log(code);

	});
	var narf = new Ajv({allErrors: true});

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
		"title": "rightsProfile",
		"type": "object",
		"properties": {
			"sublicense": { "type": "boolean" },
			"assign": { "type": "boolean" },
			"specificUserGroup": { "type": "boolean" },
			"generalPublic": { "type": "boolean" },
			"commercialInstitutionalRights": { "type": "boolean" },
			"commercialInstitutionalRights__selected": {
				properties: {
					"reproduce": { "type": "boolean" },
					"distributePhysicalCopy": { "type": "boolean" },
					"availableForStreaming": { "type": "boolean" },
					"availableForDownloading": { "type": "boolean" },
					"lease": { "type": "boolean" },
					"lend": { "type": "boolean" },
					"advertise": { "type": "boolean" },
					"derive": { "type": "boolean" }
				},
				required: ["reproduce", "distributePhysicalCopy", "availableForStreaming", "availableForDownloading", "lease", "lend", "advertise", "derive"]
			},
			"privateUsageRights": {"type": "boolean"},
			"privateUsageRights__selected":{
				properties: {
					"reproduce": { "type": "boolean"},
					"socialSharing": { "type": "boolean"},
					"derive": { "type": "boolean"},
					"resale": {"type": "boolean"}
				},
				required: ['reproduce', "socialSharing", "derive", "resale"]
			},
			"usageRightsRestricted": { "type": "boolean" },
			"exclusiveRights": { "type": "boolean" },
			"territoriallyRestricted": { "type": "boolean" },
			"temporarilyRestricted": { "type": "boolean" },
			"originalCreator": { "type": "boolean" },
			"publisherExploiter": { "type": "boolean" }
		},
		"required": [
			'sublicense',
			'assign',
			'specificUserGroup',
			'generalPublic',
			'commercialInstitutionalRights',
			'commercialInstitutionalRights__selected',
			'privateUsageRights',
			'privateUsageRights__selected',
			'usageRightsRestricted',
			'exclusiveRights',
			'territoriallyRestricted',
			'temporarilyRestricted',
			'originalCreator',
			'publisherExploiter'
		],
		additionalProperties: false
	};

	var asd = narf.validate(schema, data);
	console.log(narf.errors);

});
