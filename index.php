<?php

require_once __DIR__ . '/vendor/autoload.php';

$countries = json_decode('{"Afghanistan":"AF","Åland Islands":"AX","Albania":"AL","Algeria":"DZ","American Samoa":"AS","Andorra":"AD","Angola":"AO","Anguilla":"AI","Antarctica":"AQ","Antigua and Barbuda":"AG","Argentina":"AR","Armenia":"AM","Aruba":"AW","Australia":"AU","Austria":"AT","Azerbaijan":"AZ","Bahamas":"BS","Bahrain":"BH","Bangladesh":"BD","Barbados":"BB","Belarus":"BY","Belgium":"BE","Belize":"BZ","Benin":"BJ","Bermuda":"BM","Bhutan":"BT","Bolivia (Plurinational State of)":"BO","Bonaire, Sint Eustatius and Saba":"BQ","Bosnia and Herzegovina":"BA","Botswana":"BW","Bouvet Island":"BV","Brazil":"BR","British Indian Ocean Territory":"IO","Brunei Darussalam":"BN","Bulgaria":"BG","Burkina Faso":"BF","Burundi":"BI","Cambodia":"KH","Cameroon":"CM","Canada":"CA","Cabo Verde":"CV","Cayman Islands":"KY","Central African Republic":"CF","Chad":"TD","Chile":"CL","China":"CN","Christmas Island":"CX","Cocos (Keeling) Islands":"CC","Colombia":"CO","Comoros":"KM","Congo":"CG","Congo (Democratic Republic of the)":"CD","Cook Islands":"CK","Costa Rica":"CR","Côte d\'Ivoire":"CI","Croatia":"HR","Cuba":"CU","Curaçao":"CW","Cyprus":"CY","Czech Republic":"CZ","Denmark":"DK","Djibouti":"DJ","Dominica":"DM","Dominican Republic":"DO","Ecuador":"EC","Egypt":"EG","El Salvador":"SV","Equatorial Guinea":"GQ","Eritrea":"ER","Estonia":"EE","Ethiopia":"ET","Falkland Islands (Malvinas)":"FK","Faroe Islands":"FO","Fiji":"FJ","Finland":"FI","France":"FR","French Guiana":"GF","French Polynesia":"PF","French Southern Territories":"TF","Gabon":"GA","Gambia":"GM","Georgia":"GE","Germany":"DE","Ghana":"GH","Gibraltar":"GI","Greece":"GR","Greenland":"GL","Grenada":"GD","Guadeloupe":"GP","Guam":"GU","Guatemala":"GT","Guernsey":"GG","Guinea":"GN","Guinea-Bissau":"GW","Guyana":"GY","Haiti":"HT","Heard Island and McDonald Islands":"HM","Holy See":"VA","Honduras":"HN","Hong Kong":"HK","Hungary":"HU","Iceland":"IS","India":"IN","Indonesia":"ID","Iran (Islamic Republic of)":"IR","Iraq":"IQ","Ireland":"IE","Isle of Man":"IM","Israel":"IL","Italy":"IT","Jamaica":"JM","Japan":"JP","Jersey":"JE","Jordan":"JO","Kazakhstan":"KZ","Kenya":"KE","Kiribati":"KI","Korea (Democratic People\'s Republic of)":"KP","Korea (Republic of)":"KR","Kuwait":"KW","Kyrgyzstan":"KG","Lao People\'s Democratic Republic":"LA","Latvia":"LV","Lebanon":"LB","Lesotho":"LS","Liberia":"LR","Libya":"LY","Liechtenstein":"LI","Lithuania":"LT","Luxembourg":"LU","Macao":"MO","Macedonia (the former Yugoslav Republic of)":"MK","Madagascar":"MG","Malawi":"MW","Malaysia":"MY","Maldives":"MV","Mali":"ML","Malta":"MT","Marshall Islands":"MH","Martinique":"MQ","Mauritania":"MR","Mauritius":"MU","Mayotte":"YT","Mexico":"MX","Micronesia (Federated States of)":"FM","Moldova (Republic of)":"MD","Monaco":"MC","Mongolia":"MN","Montenegro":"ME","Montserrat":"MS","Morocco":"MA","Mozambique":"MZ","Myanmar":"MM","Namibia":"NA","Nauru":"NR","Nepal":"NP","Netherlands":"NL","New Caledonia":"NC","New Zealand":"NZ","Nicaragua":"NI","Niger":"NE","Nigeria":"NG","Niue":"NU","Norfolk Island":"NF","Northern Mariana Islands":"MP","Norway":"NO","Oman":"OM","Pakistan":"PK","Palau":"PW","Palestine, State of":"PS","Panama":"PA","Papua New Guinea":"PG","Paraguay":"PY","Peru":"PE","Philippines":"PH","Pitcairn":"PN","Poland":"PL","Portugal":"PT","Puerto Rico":"PR","Qatar":"QA","Réunion":"RE","Romania":"RO","Russian Federation":"RU","Rwanda":"RW","Saint Barthélemy":"BL","Saint Helena, Ascension and Tristan da Cunha":"SH","Saint Kitts and Nevis":"KN","Saint Lucia":"LC","Saint Martin (French part)":"MF","Saint Pierre and Miquelon":"PM","Saint Vincent and the Grenadines":"VC","Samoa":"WS","San Marino":"SM","Sao Tome and Principe":"ST","Saudi Arabia":"SA","Senegal":"SN","Serbia":"RS","Seychelles":"SC","Sierra Leone":"SL","Singapore":"SG","Sint Maarten (Dutch part)":"SX","Slovakia":"SK","Slovenia":"SI","Solomon Islands":"SB","Somalia":"SO","South Africa":"ZA","South Georgia and the South Sandwich Islands":"GS","South Sudan":"SS","Spain":"ES","Sri Lanka":"LK","Sudan":"SD","Suriname":"SR","Svalbard and Jan Mayen":"SJ","Swaziland":"SZ","Sweden":"SE","Switzerland":"CH","Syrian Arab Republic":"SY","Taiwan, Province of China":"TW","Tajikistan":"TJ","Tanzania, United Republic of":"TZ","Thailand":"TH","Timor-Leste":"TL","Togo":"TG","Tokelau":"TK","Tonga":"TO","Trinidad and Tobago":"TT","Tunisia":"TN","Turkey":"TR","Turkmenistan":"TM","Turks and Caicos Islands":"TC","Tuvalu":"TV","Uganda":"UG","Ukraine":"UA","United Arab Emirates":"AE","United Kingdom of Great Britain and Northern Ireland":"GB","United States of America":"US","United States Minor Outlying Islands":"UM","Uruguay":"UY","Uzbekistan":"UZ","Vanuatu":"VU","Venezuela (Bolivarian Republic of)":"VE","Viet Nam":"VN","Virgin Islands (British)":"VG","Virgin Islands (U.S.)":"VI","Wallis and Futuna":"WF","Western Sahara":"EH","Yemen":"YE","Zambia":"ZM","Zimbabwe":"ZW"}', true);

$questions = [
	0 => [
		'name' => 'Licensor',
		'type' => 'radio',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'Original Creator'
			],
			[
				'type' => 'given',
				'name' => 'Publisher / Exploiter'
			]
		],
		'goto' => 1
	],
	1 => [
		'name' => 'License Term',
		'type' => 'radio',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'Temporarily unrestricted',
				'goto' => 3
			],
			[
				'type' => 'given',
				'name' => 'Temporarily Restricted',
				'goto' => 2
			]
		],
		'goto' => null
	],
	2 => [
		'name' => 'Temporarily Restricted',
		'type' => 'date',
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'dates' => [
			[
				'name' => 'Date from'
			],
			[
				'required' => true,
				'name' => 'Date to'
			]
		],
		'goto' => 3
	],
	3 => [
		'name' => 'Territory',
		'type' => 'radio',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'Territorially unrestricted',
				'goto' => 5
			],
			[
				'type' => 'given',
				'name' => 'Territorially Restricted',
				'goto' => 4
			]
		],
		'goto' => null
	],
	4 => [
		'name' => 'Territorially Restricted',
		'type' => 'multiselect',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => $countries,
		'goto' => 5
	],
	5 => [
		'name' => 'Usage Rights',
		'type' => 'radio',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'All Rights',
				'goto' => 12
			],
			[
				'type' => 'given',
				'name' => 'Some Rights',
				'goto' => 6
			],
			[
				'type' => 'checkbox',
				'name' => 'Exclusive'
			]
		],
		'goto' => null
	],
	6 => [
		'name' => 'Private Usage Rights',
		'type' => 'radio',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'None',
				'goto' => 8
			],
			[
				'type' => 'given',
				'name' => 'Some Rights',
				'goto' => 7
			]
		],
		'goto' => null
	],
	7 => [
		'name' => 'Types of Private usage rights',
		'type' => 'checkbox',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'Reproduce'
			],
			[
				'type' => 'given',
				'name' => 'Social Sharing (incl. Reproduce)',
				'requirement' => [
					'checked' => ['7-0']
				]
			],
			[
				'type' => 'given',
				'name' => 'Derive (incl. Reproduce)',
				'requirement' => [
					'checked' => ['7-0']
				]
			],
			[
				'type' => 'given',
				'name' => 'Resale'
			]
		],
		'goto' => 8
	],
	8 => [
		'name' => 'Commercial/Institutional Rights',
		'type' => 'radio',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'None',
				'goto' => 10
			],
			[
				'type' => 'given',
				'name' => 'Some Rights',
				'goto' => 9
			]
		],
		'goto' => null
	],
	9 => [
		'name' => 'Types of Commercial/Institutional usage rights',
		'type' => 'checkbox',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'Reproduce'
			],
			[
				'type' => 'given',
				'name' => 'Distribute physical copy'
			],
			[
				'type' => 'given',
				'name' => 'Make available for streaming'
			],
			[
				'type' => 'given',
				'name' => 'Make available for downloading'
			],
			[
				'type' => 'given',
				'name' => 'Lease'
			],
			[
				'type' => 'given',
				'name' => 'Lend'
			],
			[
				'type' => 'given',
				'name' => 'Advertise'
			],
			[
				'type' => 'given',
				'name' => 'Derive'
			]
		],
		'goto' => 10
	],
	10 => [
		'name' => 'Auditory/end-user',
		'type' => 'checkbox',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'Specific User Group'
			],
			[
				'type' => 'given',
				'name' => 'General Public'
			]
		],
		'goto' => 11
	],
	11 => [
		'name' => 'GrandUse',
		'type' => 'checkbox',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'Sublicense'
			],
			[
				'type' => 'given',
				'name' => 'Assign'
			]
		],
		'goto' => 12
	]
];

$loader = new Twig_Loader_Filesystem(__DIR__ . '/templates');
$twig = new Twig_Environment($loader, [
	'cache' => false //__DIR__ . '/cache/twig',
]);

$template = $twig->load('index.twig');

echo $template->render([
	'questions' => $questions
]);
