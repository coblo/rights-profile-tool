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

			if (question.type === 'date') {

				var $fields = $question.find('.mdc-textfield'),
					$errors = $question.find('.mdc-textfield-helptext');

				for (var _idx in valid.reasons) {

					var reason = valid.reasons[_idx];

					$fields[_idx].classList.add('mdc-textfield--invalid');

					$errors[_idx].classList.add('mdc-textfield-helptext--persistent');

					$errors[_idx].innerText = reason;

					toast(reason);

				}

			}
			else {

				$question.find('h3').addClass('error').attr('data-error', valid.reason);

				toast(valid.reason);

			}

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
						reason: 'You have to check one option to proceed'
					};

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
						reason: 'You have to check at least one option to proceed'
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
								reason: 'You need to check the option "' + question.choices[i].name + '"'
							};

						}
						else {

							// todo do we need this case?

						}

					}

				}

			}

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

			var $$fields = $question.find('.pickadate-here'),
				reasons = {};

			question.dates.forEach(function(date, i) {

				if (date.required) {

					var dateObj = $($$fields[i]).pickadate('picker').get('select');

					if (dateObj === null) {

						reasons[i] = 'You have to select a date';

					}

				}

			});

			if (Object.keys(reasons).length > 0) {

				return {
					bool: false,
					reasons: reasons
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
						reason: 'You have to select at least one option to proceed'
					};

				}

			}

			return {
				bool: true,
				goto: question.goto
			};

		}

	};

	var getSelection = {

		radio: function(question, $question, additionalData) {

			var $$inputs = $question.find('input[type="radio"], input[type="checkbox"]'),
				value = null;

			question.choices.forEach(function(choice, i) {

				var $input = $$inputs[i];

				if ('store' in choice) {

					if ('global' in choice.store) {

						additionalData[choice.store.global] = $input.checked;

					}

					return;

				}

				if ($input.checked) {

					value = Math.pow(2, i);

				}

			});

			return value;

		},

		checkbox: function(question, $question, additionalData) {

			var $$inputs = $question.find('input[type="radio"], input[type="checkbox"]'),
				value = 0;

			question.choices.forEach(function(choice, i) {

				var $input = $$inputs[i];

				if ('store' in choice) {

					if ('global' in choice.store) {

						additionalData[choice.store.global] = $input.checked;

					}

					return;

				}

				if ($input.checked) {

					value += Math.pow(2, i);

				}

			});

			return value;

		},

		// todo: every date currently has to have a global store and nothing else is supported here
		date: function(question, $question, additionalData) {

			var $$dates = $question.find('.pickadate-here');

			question.dates.forEach(function(date, i) {

				var $date = $$dates[i],
					dateObj = $($date).pickadate('picker').get('select');

				if (dateObj === null) {

					additionalData[date.store.global] = null;

					return;

				}

				additionalData[date.store.global] = [dateObj.year].concat([dateObj.month + 1, dateObj.date].map(function(num) { return num < 10 ? '0' + num : num; })).join('-');

			});

			return null;

		},

		// todo: each multiselect currently has to have a global store and nothing else is supported here
		multiselect: function(question, $question, additionalData) {

			return $question.find('.mdc-select').get().map(function($el) { return $el.value; }).filter(function(v, i, a) { return !!v && a.indexOf(v) === i; });

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

			$field.addClass('mdc-textfield--invalid');

			$error.addClass('mdc-textfield-helptext--persistent');

			$error.text('You have to select a date');

		}
		else {

			$field.find('.mdc-textfield__label').addClass('mdc-textfield__label--float-above');

			var valid = validate[question.type](question, $question);

			if (valid.bool === false) {

				var _idx = $field.data('idx');

				if (_idx in valid.reasons) {

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
			identifierData = new Array(questions.length),
			additionalData = {};

		while (question || i === 0) {

			var r = getSelection[question.type](question, $question, additionalData);

			if ('store' in question) {

				if ('global' in question.store) {

					additionalData[question.store.global] = r;

				}

			}
			else if (r !== null) {

				identifierData[i] = r;

			}

			i = question.backto;
			question = questions[i];
			$question = $$questions[i];

		}

		console.log(identifierData, additionalData);

		$('#rights-profile-code').text('todo');

	}

});
