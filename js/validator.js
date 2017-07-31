document.addEventListener('DOMContentLoaded', function() {

	document.querySelector('#validate').addEventListener('click', function() {

		var code = JSON.parse(document.querySelector('#rpc').value);

		console.log(validate(code));

	});

	var schema = {
		title: 'rightsProfile',
		type: 'object',
		properties: {
			originalCreator: { type: 'boolean' },
			publisherExploiter: { type: 'boolean' },
			temporarilyRestricted: { type: 'boolean' },
			territoriallyRestricted: { type: 'boolean' },
			usageRightsRestricted: { type: 'boolean' },
			exclusiveRights: { type: 'boolean' },
			privateUsageRights: {type: 'boolean'},
			privateUsageRights__selected:{
				properties: {
					reproduce: { type: 'boolean'},
					socialSharing: { type: 'boolean'},
					derive: { type: 'boolean'},
					resale: {type: 'boolean'}
				},
				required: [ 'reproduce', 'socialSharing', 'derive', 'resale' ],
				additionalProperties: false
			},
			commercialInstitutionalRights: { type: 'boolean' },
			commercialInstitutionalRights__selected: {
				properties: {
					reproduce: { type: 'boolean' },
					distributePhysicalCopy: { type: 'boolean' },
					availableForStreaming: { type: 'boolean' },
					availableForDownloading: { type: 'boolean' },
					lease: { type: 'boolean' },
					lend: { type: 'boolean' },
					advertise: { type: 'boolean' },
					derive: { type: 'boolean' }
				},
				required: [ 'reproduce', 'distributePhysicalCopy', 'availableForStreaming', 'availableForDownloading', 'lease', 'lend', 'advertise', 'derive' ],
				additionalProperties: false
			},
			specificUserGroup: { type: 'boolean' },
			generalPublic: { type: 'boolean' },
			sublicense: { type: 'boolean' },
			assign: { type: 'boolean' }
		},
		required: [ 'sublicense', 'assign', 'specificUserGroup', 'generalPublic', 'commercialInstitutionalRights', 'commercialInstitutionalRights__selected', 'privateUsageRights', 'privateUsageRights__selected', 'usageRightsRestricted', 'exclusiveRights', 'territoriallyRestricted', 'temporarilyRestricted', 'originalCreator', 'publisherExploiter' ],
		additionalProperties: false
	};

	var validator = new Ajv({allErrors: true});

	function validate(data) {

		validator.validate(schema, data);

		var structureErrors = validator.errors || [];

		var logicalErrors = [];

		if (data.originalCreator === data.publisherExploiter) {

			// the values must be different because it's a radio

			logicalErrors[logicalErrors.length] = 'originalCreator and publisherExploiter can\'t have the same values';

		}

		// get all checked options from the rights-questions

		var prop;
		var privateUsageRights = [];
		for (prop in data.privateUsageRights__selected) {

			if (data.privateUsageRights__selected[prop]) {

				privateUsageRights[privateUsageRights.length] = 'privateUsageRights__selected.' + prop;

			}

		}

		var commercialInstitutionalRights = [];
		for (prop in data.commercialInstitutionalRights__selected) {

			if (data.commercialInstitutionalRights__selected[prop]) {

				commercialInstitutionalRights[commercialInstitutionalRights.length] = 'commercialInstitutionalRights__selected.' + prop;

			}

		}

		// some rights
		if (data.usageRightsRestricted) {

			if (!data.privateUsageRights && !data.commercialInstitutionalRights) {

				logicalErrors[logicalErrors.length] = 'neither privateUsageRights or commercialInstitutionalRights are selected but usageRightsRestricted is set';

			}

			if ((privateUsageRights.length + commercialInstitutionalRights.length) === 0) {

				logicalErrors[logicalErrors.length] = 'no rights from privateUsageRights__selected or commercialInstitutionalRights__selected are selected but usageRightsRestricted is set';

			}

			if (
				(privateUsageRights.length === Object.keys(schema.properties.privateUsageRights__selected.properties).length)
				&&
				(commercialInstitutionalRights.length === Object.keys(schema.properties.commercialInstitutionalRights__selected.properties).length)
			) {

				privateUsageRights.concat(commercialInstitutionalRights).forEach(function(right) {

					logicalErrors[logicalErrors.length] = right + ' selected but usageRightsRestricted is set';

				});

			}

			if (data.specificUserGroup === data.generalPublic) {

				logicalErrors[logicalErrors.length] = 'specificUserGroup and generalPublic can\'t have the same values';

			}

			if (data.sublicense === data.assign) {

				logicalErrors[logicalErrors.length] = 'sublicense and assign can\'t have the same values';

			}

		}
		// all rights
		else {

			if (data.privateUsageRights) {

				logicalErrors[logicalErrors.length] = 'privateUsageRights set but usageRightsRestricted is false';

			}

			if (data.commercialInstitutionalRights) {

				logicalErrors[logicalErrors.length] = 'commercialInstitutionalRights set but usageRightsRestricted is false';

			}

			if ((privateUsageRights.length + commercialInstitutionalRights.length) > 0) {

				privateUsageRights.concat(commercialInstitutionalRights).forEach(function(right) {

					logicalErrors[logicalErrors.length] = right + ' selected but usageRightsRestricted is false';

				});

			}

			if (data.specificUserGroup) {

				logicalErrors[logicalErrors.length] = 'specificUserGroup selected but usageRightsRestricted is false';

			}

			if (data.generalPublic) {

				logicalErrors[logicalErrors.length] = 'generalPublic selected but usageRightsRestricted is false';

			}

			if (data.sublicense) {

				logicalErrors[logicalErrors.length] = 'sublicense selected but usageRightsRestricted is false';

			}

			if (data.assign) {

				logicalErrors[logicalErrors.length] = 'assign selected but usageRightsRestricted is false';

			}

		}

		if (!data.privateUsageRights) {

			// if checked options from privateUsageRights__selected exist => error
			if (privateUsageRights.length) {

				privateUsageRights.forEach(function(right) {

					logicalErrors[logicalErrors.length] = right + ' not allowed because privateUsageRights is false';

				});

			}

		}
		else {

			if (privateUsageRights.length === 0) {

				logicalErrors[logicalErrors.length] = 'no rights from privateUsageRights__selected are selected but privateUsageRights is set';

			}

		}

		if (!data.commercialInstitutionalRights) {

			// if checked options from commercialInstitutionalRights__selected exist => error
			if (commercialInstitutionalRights.length) {

				commercialInstitutionalRights.forEach(function(right) {

					logicalErrors[logicalErrors.length] = right + ' not allowed because commercialInstitutionalRights is false';

				});

			}

		}
		else {

			if (commercialInstitutionalRights.length === 0) {

				logicalErrors[logicalErrors.length] = 'no rights from commercialInstitutionalRights__selected are selected but commercialInstitutionalRights is set';

			}

		}

		return {structure: structureErrors, logical: logicalErrors};

	}

});
