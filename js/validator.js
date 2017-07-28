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
		"privateUsageRights": {
			"enable": true,
			"reproduce":true,
			"socialSharing":true,
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
		"title": "Person",
		"type": "object",
		"properties": {
			"sublicense": { "type": "boolean" },
			"assign": { "type": "boolean" },
			"specificUserGroup": { "type": "boolean" },
			"generalPublic": { "type": "boolean" },
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
			"commercialInstitutionalRights": { "type": "boolean" },

			"privateUsageRights": {  "$ref": "privateUsageRights" },
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
			'exclusiveRights',
			'privateUsageRights'
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
					"enable": { "const": true},
					"reproduce": { "type": "boolean" },
					"socialSharing": { "type": "boolean" },
					"derive": { "type": "boolean" },
					"resale": { "type": "boolean" }
				},
				"required":["enable", "reproduce","socialSharing","derive","resale"]
			},
			{
				"properties": {
					"enable": { "const": false},
				},
				"required":["enable"]
			}
		],
	}
	narf.addSchema(privateUsageRights)
	var asd = narf.validate(schema, data)
	console.log(narf.errors);

	var commercial = {
		"$schema": "http://json-schema.org/draft-06/schema#",
		"$id": "rpc",
		"title": "Rights profile code",
		"type": "object",
		"additionalProperties": false,
		"oneOf": [
			{
				"properties": {
					"commercialInstitutionalRights": {
						"type": "boolean",
						"must": true
					},
					"reproduce": false,
					"distributePhysicalCopy": true,
					"availableForStreaming": false,
					"availableForDownloading": false,
					"lease": false,
					"lend": false,
					"advertise": true,
					"derive": false
				},
				"required": ["reproduce", "distributePhysicalCopy", "availableForStreaming", "availableForDownloading", "lease", "lend", "advertise", "derive"]
			},
			{
				"properties": {
					"commercialInstitutionalRights": {
						"type": "boolean",
						"must": false
					}
				}
			}
		],
	}

	var realSchema = {
		"$schema": "http://json-schema.org/draft-06/schema#",
		"$id": "rpc",
		"title": "Rights profile code",
		"type": "object",
		"additionalProperties": false,
		"oneOf": [
			{
				"properties": {
					"commercialInstitutionalRights": {
						"type": "boolean",
						"must": true
					},
					"reproduce": false,
					"distributePhysicalCopy": true,
					"availableForStreaming": false,
					"availableForDownloading": false,
					"lease": false,
					"lend": false,
					"advertise": true,
					"derive": false
				},
				"required": ["reproduce", "distributePhysicalCopy", "availableForStreaming", "availableForDownloading", "lease", "lend", "advertise", "derive"]
			},
			{
				"properties": {
					"commercialInstitutionalRights": {
						"type": "boolean",
						"must": false
					}
				}
			}
		],
		"properties": {
			"sublicense": {
				"description": "TODO",
				"type": "boolean",
				"default": false
			},
			"commercialInstitutionalRights": {
				"description": "TODO",
				"type": "boolean",
				"default": false
			},

			"time_zone": {
				"type": "string",
				"default": "UTC"
			}
		},
		"required": ["graphs", "manual_value_range", "time_zone", "time_scale"],
		"definitions": {
			"metric": {
				"type": "object",
				"default": {},
				"properties": {
					"step_size": {
						"type": "integer",
						"default": 5
					},
					"tags": { "$ref": "tags#/definitions/tags" },
					"colors": {
						"type": "object",
						"default":{}
					},
					"time_unit_unit": {
						"type": "string",
						"enum": ["seconds", "minutes", "hours"],
						"default": "minutes"
					},
					"time_unit_value": {
						"type": "integer",
						"default": 1
					},
					"finer_resolution": {
						"type": "boolean",
						"default": false
					},
					"disable_anti_aliasing": {
						"type": "boolean",
						"default": false
					},
					"resolution_debug_mode": {
						"type": "boolean",
						"default": false
					}
				},
				"required": ["tags"]
			},
			"nature": {
				"type": "string",
				"enum": ["throughput", "histogram", "marker"],
				"default": "throughput"
			}
		}
	};

});
