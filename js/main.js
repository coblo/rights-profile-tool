$(function() {

	var $slider = $('#questions-slider'),
		$container = $slider.find('.container'),
		$$questions = $container.children().get().map(function($el) { return $($el); }), // array of jQuery objects
		scrollHeights = $$questions.map(function($el) { return $el[0].scrollHeight; }), // todo: this still fails when resizing
		maxSlides = 1000,
		translationOffsetPerImage = 1 / maxSlides * 100,
		translateOffset = 0;

	var $back = $('button.back'),
		$continue = $('button.continue'),
		$pageCount = $('#page-count'),
		$progress = $('#progress');

	var idx = 0,
		sliderHeight;

	$('#start').on('click', function() {

		sliderHeight = scrollHeights[0];

		$slider.css('height', sliderHeight);

		document.body.classList.add('started');

	});

	$progress[0].MDCLinearProgress.progress = 1 / questions.length;

	$('.pickadate-here').pickadate({
		container: document.body,
		selectYears: 15,
		onOpen: function() {

			pickadateValidate(this, null, false);

		},
		onSet: function(ctx) {

			pickadateValidate(this, ctx, true);

		}
	});

	$('.date-aligner button').click(function(e) {

		var picker = $(this.previousElementSibling).find('.pickadate-here').pickadate('picker');

		e.stopPropagation();
		e.preventDefault();

		picker.open();

	});

	$('section.multiselect button').on('click', function() {

		var $this = $(this),
			$question = $this.parents('section.multiselect'),
			$lastSelect = $question.find('select:last-of-type'),
			$clonedSelect = $lastSelect.clone(true);

		$clonedSelect.find('option[default]').attr('selected', true);

		$clonedSelect.insertAfter($lastSelect);

		sliderHeight += $clonedSelect.outerHeight(true);

		scrollHeights[$question.data('idx')] = sliderHeight;

		$slider.css('height', sliderHeight);

	});

	$back.on('click', function() {

		var question = questions[idx],
			goto = question.backto;

		delete question.backto;

		translateOffset = -goto * translationOffsetPerImage;

		$container.css({
			transform: 'translate3d(' + translateOffset + '%, 0, 0)'
		});

		var oldSliderheight = sliderHeight;
		sliderHeight += scrollHeights[goto] - scrollHeights[idx];

		animateSliderHeight(oldSliderheight, sliderHeight);

		$pageCount.text(goto + 1);
		$progress[0].MDCLinearProgress.progress = (goto + 1) / questions.length;

		if (idx === 1) {

			$back.attr('disabled', true);

		}

		if (idx === questions.length - 1) {

			$continue.text('Continue');

		}

		idx = goto;

	});

	$continue.on('click', function() {

		var question = questions[idx],
			$question = $$questions[idx];

		var valid = validate[question.type](question, $question);

		if (valid.bool === false) {

			if (question.type === 'date' && valid.reasons) {

				var $fields = $question.find('.mdc-textfield'),
					$errors = $question.find('.mdc-textfield-helptext');

				for (var _idx in valid.reasons) {

					var reason = valid.reasons[_idx];

					$fields[_idx].classList.add('mdc-textfield--invalid');

					$errors[_idx].classList.add('mdc-textfield-helptext--persistent');

					$errors[_idx].innerText = reason;

				}

			}
			else if (question.type === 'radio' && valid.reasons) {

				var $$fields = $question.find('input[type="radio"]');

				for (var _idx in valid.reasons) {

					var reason = valid.reasons[_idx],
						$parent = $($$fields[_idx]).parent('.mdc-radio');

					$parent.addClass('invalid');

					$parent.find('+ label').attr('data-error', reason);

				}

			}

			$question.find('h3').addClass('error').attr('data-error', valid.reason);

			toast(valid.reason);

		}
		else {

			if (valid.goto === questions.length) {

				finished();

				return;

			}

			$question.find('.mdc-checkbox.invalid, .mdc-radio.invalid').removeClass('invalid');
			$question.find('h3').removeClass('error');

			questions[valid.goto].backto = idx;

			translateOffset = -valid.goto * translationOffsetPerImage;

			$container.css({
				transform: 'translate3d(' + translateOffset + '%, 0, 0)'
			});

			var oldSliderheight = sliderHeight;
			sliderHeight += scrollHeights[valid.goto] - scrollHeights[idx];

			animateSliderHeight(oldSliderheight, sliderHeight);

			$pageCount.text(valid.goto + 1);
			$progress[0].MDCLinearProgress.progress = (valid.goto + 1) / questions.length;

			if (idx === 0) {

				$back.removeAttr('disabled');

			}

			if (idx === questions.length - 2) {

				$continue.text('Finish');

			}

			idx = valid.goto;

		}

	});

	var checkboxValidationReasons = [
		{
			name: 'all',
			text: 'all options'
		},
		{
			name: 'n',
			text: 'some options'
		},
		{
			name: 'none',
			text: 'no options'
		}
	];

	var validate = {

		radio: function(question, $question) {

			var $checked = $question.find('input[type="radio"]:checked');

			if (question.required === true) {

				if ($checked.length === 0) {

					return {
						bool: false,
						reason: 'One option is required to proceed'
					};

				}

			}

			// todo support multiple
			var choice = question.choices[$checked.val()];
			if ('requirement' in choice) {

				if ('notChecked' in choice.requirement) {

					var trash = choice.requirement.notChecked.split('-'),
						idx = parseInt(trash[0]),
						i = parseInt(trash[1]);

					var $target = $('#question-' + idx + '-' + i);

					if ($target.is(':checked')) {

						var reasons = {};
						reasons[i] = choice.customError.option;

						// todo also add default message
						return {
							bool: false,
							reason: choice.customError.general,
							reasons: reasons
						};

					}

				}

			}

			var conditionalGotos = question.choices.filter(function(el) { return 'goto' in el; });
			if ($checked.length === 1 && conditionalGotos.length > 0) {

				return {
					bool: true,
					goto: question.choices[$checked[0].value].goto
				};

			}

			return {
				bool: true,
				goto: question.goto
			};

		},

		checkbox: function(question, $question) {

			var $$fields = $question.find('input[type="checkbox"]').get(),
				checked = $$fields.filter(function($el) { return $el.checked; }).length;

			if (question.required === true) {

				if (checked === 0) {

					return {
						bool: false,
						reason: 'At least one option is required to proceed'
					};

				}

			}

			var requirements = {};
			question.choices.forEach(function(el, i) {

				if ($$fields[i].checked === true && el.requirement) {

					if (el.requirement.checked) {

						requirements.checked = requirements.checked || {};

						el.requirement.checked.forEach(function(idx_i) {

							requirements.checked[idx_i] = true;

						});

					}

				}

			});

			if ('checked' in requirements) {

				for (var idx_i in requirements.checked) {

					var trash = idx_i.split('-'),
						idx = parseInt(trash[0]),
						i = parseInt(trash[1]);

					var $target = $('#question-' + idx + '-' + i);

					if (!$target.is(':checked')) {

						var $parent = $target.parent('.mdc-checkbox'),
							$label = $parent.find('+ label');

						$parent.addClass('invalid');
						$label.attr('data-error', 'This option is required due to your selection');

						// same page
						if (idx === questions.indexOf(question)) {

							return {
								bool: false,
								reason: 'The option "' + question.choices[i].name + '" is required due to your selection'
							};

						}
						else {

							// todo do we need this case?

						}

					}

				}

			}

			// this is currently not in use
			if (question.validation && question.validation.length) {

				for (var i = 0, len = question.validation.length, type; type = question.validation[i], i < len; i = i + 1) {

					if (type === 'all') {

						if (checked === $$fields.length) {

							return {
								bool: true,
								goto: question.goto
							};

						}

					}

					if (type === 'none') {

						if (checked === 0) {

							return {
								bool: true,
								goto: question.goto
							};

						}

					}

					if (type === 'n') {

						if (checked !== 0) {

							return {
								bool: true,
								goto: question.goto
							};

						}

					}

				}

				var reasons = checkboxValidationReasons
					.filter(function(reason) { return question.validation.indexOf(reason.name) !== -1; })
					.map(function(reason) { return reason.text; });

				var singleReason;

				if (reasons.length === 1) {

					singleReason = 'Please check ' + reasons[0];

				}
				else {

					singleReason = 'Please either check ' + reasons.slice(0, -1).join(', ') + ' or ' + reasons[reasons.length - 1];

				}

				return {
					bool: false,
					reason: singleReason
				};

			}

			return {
				bool: true,
				goto: question.goto
			};

		},

		date: function(question, $question) {

			var idx = $question.data('idx'),
				$$fields = $question.find('.pickadate-here'),
				reasons = {};

			question.dates.forEach(function(date, i) {

				if (date.required) {

					var dateObj = $($$fields[i]).pickadate('picker').get('select');

					if (dateObj === null) {

						reasons[i] = 'This date is required to proceed';

					}

				}

			});

			var requirements = {};
			question.dates.forEach(function(date, i) {

				if (date.requirement) {

					if (date.requirement.gt) {

						requirements.gt = requirements.gt || {};

						date.requirement.gt.forEach(function(idx_i) {

							requirements.gt[idx + '-' + i] = idx_i;

						});

					}

				}

			});

			if ('gt' in requirements) {

				for (var target in requirements.gt) {

					var targetTrash = target.split('-'),
						targetIdx = parseInt(targetTrash[0]),
						targetI = parseInt(targetTrash[1]),
						compareTrash = requirements.gt[target].split('-'),
						compareIdx = parseInt(compareTrash[0]),
						compareI = parseInt(compareTrash[1]);

					var $target = $('#question-' + targetIdx + '-' + targetI),
						$compare = $('#question-' + compareIdx + '-' + compareI),
						targetDateObj = $target.pickadate('picker').get('select'),
						compareDateObj = $compare.pickadate('picker').get('select');

					if (compareDateObj && targetDateObj && targetDateObj.pick < compareDateObj.pick) {

						var reasons = {};
						reasons[targetI] = '"' + question.dates[compareI].name + '" needs to be earlier than this';

						// same page
						if (idx === questions.indexOf(question)) {

							return {
								bool: false,
								reasons: reasons,
								reason: 'The selected date "' + question.dates[targetI].name + '" needs to be later than "' + question.dates[compareI].name + '"'
							};

						}
						else {

							// todo do we need this case?

						}

					}

				}

			}

			if (Object.keys(reasons).length > 0) {

				return {
					bool: false,
					reasons: reasons,
					reason: 'At least one date is required'
				};

			}

			return {
				bool: true,
				goto: question.goto
			};

		},

		multiselect: function(question, $question) {

			var $fields = $question.find('.mdc-select');

			if (question.required === true) {

				if ($fields.get().reduce(function(acc, $el) { return acc + $el.value; }, '').length === 0) {

					return {
						bool: false,
						reason: 'At least one option is required to proceed'
					};

				}

			}

			return {
				bool: true,
				goto: question.goto
			};

		}

	};

	var makeSchema = {

		// no store for the question BUT set for the choices
		radio: function(question, $question, identifierData) {

			var $$inputs = $question.find('input[type="radio"], input[type="checkbox"]');

			question.choices.forEach(function(choice, i) {

				var $input = $$inputs[i];

				if ('store' in choice) {

					identifierData[choice.store] = $input.checked;

				}

				if ($input.checked && typeof choice.set === 'object') {

					for (var prop in choice.set) {

						identifierData[prop] = choice.set[prop];

					}

				}

			});

		},

		// store for the question OR set for choices
		checkbox: function(question, $question, identifierData) {

			var $$inputs = $question.find('input[type="radio"], input[type="checkbox"]');

			if ('store' in question) {

				identifierData[question.store] = {};

			}

			question.choices.forEach(function(choice, i) {

				var $input = $$inputs[i];

				if ($input.checked && typeof choice.set === 'object') {

					for (var prop in choice.set) {

						identifierData[prop] = choice.set[prop];

					}

				}

				if ('store' in question) {

					identifierData[question.store][choice.value] = $input.checked;

				}

			});

		},

		// store for the question BUT NOTHING for the choices
		date: function(question, $question, identifierData) {

			identifierData[question.store] = {};

			var $$dates = $question.find('.pickadate-here');

			question.dates.forEach(function(date, i) {

				var $date = $$dates[i],
					dateObj = $($date).pickadate('picker').get('select');

				if (dateObj === null) {

					identifierData[question.store][date.value] = null;

				}
				else {

					identifierData[question.store][date.value] = [dateObj.year].concat([dateObj.month + 1, dateObj.date].map(function(num) { return num < 10 ? '0' + num : num; })).join('-');

				}

			});

		},

		// store for the question BUT NOTHING for the choices
		multiselect: function(question, $question, identifierData) {

			identifierData[question.store] = {};

			$question.find('.mdc-select').get().map(function($el) { return $el.value; }).filter(function(v, i, a) { return !!v && a.indexOf(v) === i; }).forEach(function(countryCode) {

				identifierData[question.store][countryCode] = true;

			});

		}

	};

	var snackbar = document.querySelector('#toast-container').MDCSnackbar;
	function toast(text) {

		var data =  {
			message: text,
			actionOnBottom: false,
			multiline: false,
			timeout: 2750
		};

		snackbar.show(data);

	}

	function pickadateValidate(that, ctx, isOnSet) {

		var $field = that.$node.parent('.mdc-textfield'),
			$error = $field.next('.mdc-textfield-helptext'),
			idx = $field.parents('section[id^="question-"]').data('idx'),
			question = questions[idx],
			$question = $$questions[idx];

		if (isOnSet && 'clear' in ctx) {

			that.close();

			$field.find('.mdc-textfield__label').removeClass('mdc-textfield__label--float-above');

			if (question.dates[$field.data('idx')].required) {

				$field.addClass('mdc-textfield--invalid');

				$error.addClass('mdc-textfield-helptext--persistent');

				$error.text('This date is required to proceed');

			}

		}
		else {

			if (that.$node.val()) {

				$field.find('.mdc-textfield__label').addClass('mdc-textfield__label--float-above');

			}

			var valid = validate[question.type](question, $question);

			if (valid.bool === false) {

				var _idx = $field.data('idx');

				if (valid.reasons && _idx in valid.reasons) {

					var reason = valid.reasons[_idx];

					$field.addClass('mdc-textfield--invalid');

					$error.addClass('mdc-textfield-helptext--persistent');

					$error.text(reason);

				}

			}
			else {

				$field.removeClass('mdc-textfield--invalid');
				$error.removeClass('mdc-textfield-helptext--persistent').html('&nbsp;');

			}

		}

	}

	function animateSliderHeight(oldHeight, newHeight) {

		if (oldHeight === newHeight) {

			return;

		}

		var $nonjquery = $slider[0];

		if ('animate' in $nonjquery && typeof $nonjquery.animate === 'function') {

			var anim = $nonjquery.animate([
				{ height: oldHeight + 'px' },
				{ height: newHeight + 'px' }
			], {
				duration: 500,
				delay: 500,
				easing: 'cubic-bezier(0, 0, .2, 1)'
			});

			anim.onfinish = function() {

				$nonjquery.style.height = newHeight + 'px';

			};

		}
		else {

			$slider.stop().delay(500).animate({height: newHeight}, 500);

		}

	}

	function finished() {

		document.body.classList.add('finished');

		var i = questions.length - 1,
			question = questions[i];

		while (question.backto === undefined) {

			i--;
			question = questions[i];

		}

		var $question = $$questions[i],
			data = {
				rightsProfile: {},
				smartLicense: {}
			};

		while (question || i === 0) {

			makeSchema[question.type](question, $question, data[question.storeIn || 'rightsProfile']);

			i = question.backto;
			question = questions[i];
			$question = $$questions[i];

		}

		// check if all rights are checked but the user said some rights and repair it
		if (data.rightsProfile.usageRightsRestricted === true) {

			var everyRightSelected = ['privateUsageRights__selected', 'commercialInstitutionalRights__selected'].map(function(property) {

				var exists = property in data.rightsProfile;

				if (!exists) {

					return false;

				}

				for (var right in data.rightsProfile[property]) {

					if (data.rightsProfile[property][right] === false) {

						return false;

					}

				}

				return true;

			});

			if (everyRightSelected[0] === true && everyRightSelected[1] === true) {

				data.rightsProfile.usageRightsRestricted = false;

				delete data.rightsProfile.privateUsageRights;
				delete data.rightsProfile.commercialInstitutionalRights;

				delete data.rightsProfile.privateUsageRights__selected;
				delete data.rightsProfile.commercialInstitutionalRights__selected;

			}

		}

		console.log(data);
		console.log(JSON.stringify(data, null, 2));

		$('#rights-profile-code').text('todo');

	}

});
