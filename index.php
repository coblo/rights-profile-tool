<?php

require_once __DIR__ . '/vendor/autoload.php';

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
		'type' => 'checkbox',
		'required' => true,
		'text' => 'todo: add text',
		'question' => 'todo: add question',
		'choices' => [
			[
				'type' => 'given',
				'name' => 'DACH'
			],
			[
				'type' => 'given',
				'name' => 'EU'
			],
			[
				'type' => 'given',
				'name' => 'US'
			],
			[
				'type' => 'given',
				'name' => 'UK'
			],
			[
				'type' => 'given',
				'name' => 'A/SEA'
			],
			[
				'type' => 'given',
				'name' => 'Worldwide'
			],
			[
				'type' => 'free',
				'placeholder' => 'Other'
			]
		],
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
				'name' => 'Social Sharing (incl. Reproduce)'
			],
			[
				'type' => 'given',
				'name' => 'Derive (incl. Reproduce)'
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
