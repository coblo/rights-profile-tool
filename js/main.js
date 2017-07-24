$(function() {

	var $slider = $('#questions-slider'),
		$container = $slider.find('.container'),
		$$questions = Array.prototype.slice.call($container.children()).map(function($el) { return $($el); }), // array of jQuery objects
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

	var globalInfo = {};

	$('#start').on('click', function() {

		sliderHeight = $$questions[0][0].scrollHeight;

		$slider.css('height', sliderHeight);

		document.body.classList.add('started');

	});

	$progress.on('mdl-componentupgraded', function() {

		this.MaterialProgress.setProgress(1 / questions.length * 100);

	});

	$('.pickadate-here').pickadate({
		container: document.body,
		selectYears: 15,
		onSet: function(ctx) {

			if ('clear' in ctx) {

				this.close();

			}

			this.$node.parent('.mdl-js-textfield')[0].MaterialTextfield.change(this.$node.val());

		}
	});

	// todo also skip the unwanted questions when going back
	$back.on('click', function() {

		var question = questions[idx],
			$question = $$questions[idx];

		var goto = idx - 1;

		translateOffset = -goto * translationOffsetPerImage;

		$container.css({
			transform: 'translate3d(' + translateOffset + '%, 0, 0)'
		});

		sliderHeight += scrollHeights[goto] - scrollHeights[idx];

		$slider.css('height', sliderHeight);

		$pageCount.text(goto + 1);
		$progress[0].MaterialProgress.setProgress((goto + 1) / questions.length * 100);

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

		var valid = validate[question.type](question, $question),
			$badges = $question.find('h3 .mdl-badge'),
			$tooltips = $('body > .mdl-tooltip[data-mdl-for^="errors-' + idx + '"]');

		if (valid.bool === false) {

			if (question.type === 'date') {

				for (var _idx in valid.reasons) {

					var $badge = $($badges[_idx]),
						$tooltip = $($tooltips[_idx]),
						reason = valid.reasons[_idx];

					$badge.attr('data-badge', '!');

					$tooltip.text(reason).show();

					componentHandler.upgradeElement($badge[0]);

					toast(reason);

				}

			}
			else {

				$badges.attr('data-badge', '!');

				$tooltips.text(valid.reason).show();

				componentHandler.upgradeElement($badges[0]);

				toast(valid.reason);

			}

		}
		else {

			$badges.removeAttr('data-badge');

			$tooltips.hide();

			if (valid.goto === questions.length) {

				console.log(globalInfo);

				document.body.classList.add('finished');

				var rightsProfileCode = encodeResult();

				$('#rights-profile-code').text(rightsProfileCode);

				return;

			}

			translateOffset = -valid.goto * translationOffsetPerImage;

			$container.css({
				transform: 'translate3d(' + translateOffset + '%, 0, 0)'
			});

			sliderHeight += scrollHeights[valid.goto] - scrollHeights[idx];

			$slider.css('height', sliderHeight);

			$pageCount.text(valid.goto + 1);
			$progress[0].MaterialProgress.setProgress((valid.goto + 1) / questions.length * 100);

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

						reasons[i] = '"' + date.name + '" has to be filled';

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

		}

	};

	var encode = {

		radio: function(question, $question) {

			var $$fields = $question.find('input[type="radio"]');
			var value = 0;

			$$fields.each(function(i, $field) {

				if ($field.checked === true) {

					value += Math.pow(2, i);

					if (question.choices[i].type === 'free') {

						var idx_i = $question.data('idx') + '-' + i;

						globalInfo[idx_i] = $('#question-' + idx_i).val();

					}

				}

			});

			return btoa(value).replace(/=+$/, '');

		},

		checkbox: function(question, $question) {

			var $$fields = $question.find('input[type="checkbox"]');
			var value = 0;

			$$fields.each(function(i, $field) {

				if ($field.checked === true) {

					value += Math.pow(2, i);

					if (question.choices[i].type === 'free') {

						var idx_i = $question.data('idx') + '-' + i;

						globalInfo[idx_i] = $('#question-' + idx_i).val();

					}

				}

			});

			return btoa(value).replace(/=+$/, '');

		},

		date: function(question, $question) {

			var $$fields = $question.find('.pickadate-here');
			var value = 0;

			$$fields.each(function(i, $field) {

				var dateObj = $($field).pickadate('picker').get('select');

				if (dateObj !== null) {

					value += Math.pow(2, i);

					var idx_i = $question.data('idx') + '-' + i;

					globalInfo[idx_i] = [dateObj.obj.getFullYear(), dateObj.obj.getMonth() + 1, dateObj.obj.getDate()]
						.map(function(el) { if (el > 31) return el; return el < 10 ? '0' + el : el; })
						.join('-');

				}

			});

			return btoa(value).replace(/=+$/, '');

		}

	};

	var recover = {

		radio: function(value, question, $question) {

			var $$labels = $question.find('.mdl-js-radio');

			var bit = 0;
			while(Math.pow(2, bit) <= value) {

				var bitSet = (value >> bit) % 2 != 0;

				if (bitSet) {

					$$labels[bit].MaterialRadio.check();

					// if (question.choices[bit].type === 'free') {
					//
					// 	$$labels[bit].nextElementSibling.MaterialTextfield.change(valueAdditions.shift());
					//
					// }

				}

				bit++;

			}

		},

		checkbox: function(value, question, $question) {

			var $$labels = $question.find('.mdl-js-checkbox');

			var bit = 0;
			while(Math.pow(2, bit) <= value) {

				var bitSet = (value >> bit) % 2 != 0;

				if (bitSet) {

					$$labels[bit].MaterialCheckbox.check();

					// if (question.choices[bit].type === 'free') {
					//
					// 	$$labels[bit].nextElementSibling.MaterialTextfield.change(valueAdditions.shift());
					//
					// }

				}

				bit++;

			}

		},

		date: function(value, question, $question) {

			var $$fields = $question.find('.pickadate-here');

			var bit = 0;
			while(Math.pow(2, bit) <= value) {

				var bitSet = (value >> bit) % 2 != 0;

				if (bitSet) {

					// var dateParts = valueAdditions.shift().split('-');
					//
					// dateParts[1]--; // month is zero based
					//
					// $($$fields[bit]).pickadate('picker').set('select', dateParts);

				}

				bit++;

			}

		}

	}

	var $snackbarContainer = document.querySelector('#toast-container');
	function toast(text) {

		$snackbarContainer.MaterialSnackbar.showSnackbar({message: text});

	}

	function encodeResult() {

		var results = [];

		questions.forEach(function(question, i) {

			var $question = $$questions[i];

			var result = encode[question.type](question, $question);

			if (results.length > 0) {

				var lastResult = results[results.length - 1],
					lastValue,
					lastMultiplier;

				if (lastResult.indexOf(':') === -1) {

					lastValue = lastResult;
					lastMultiplier = 1;

				}
				else {

					var lastIndex = lastResult.lastIndexOf(':');

					lastValue = lastResult.substr(0, lastIndex);
					lastMultiplier = parseInt(lastResult.substr(lastIndex + 1));

				}

				if (lastValue === result) {

					results[results.length - 1] = lastValue + ':' + (lastMultiplier + 1);

					return;

				}

			}

			if (result === lastResult) {

				var multiplier = lastResult.indexOf(':') === -1 ? 0 : parseInt(lastResult.replace(/^.*:(\d+)$/, '$1'));

				results[results.length - 1] = results[results.length - 1].replace(/^.*:(\d+)$/, multiplier + 1);

			}

			results[results.length] = result;

		});

		return results.join('-');

	}

	window.decodeResult = decodeResult; // todo remove
	function decodeResult(result) {

		var decodedResult = result.replace(/([^-]+):(\d)/g, function(match, br1, br2) {

				var repeated = ((br1 + '-').repeat(br2));

				return repeated.substr(0, repeated.length - 1);

		}).split('-').map(atob);

		decodedResult.forEach(function(code, i) {

			var question = questions[i],
				$question = $$questions[i];

			var codeParts = code.split(':');

			recover[question.type](parseInt(codeParts[0]), question, $question);

		});

	}

});
