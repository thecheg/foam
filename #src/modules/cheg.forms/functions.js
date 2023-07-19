/*
 * Forms - validate, send, clear
*/
export const Forms = class {
	constructor(form, options) {
		this.form = form;
		this.options = $.extend({
			classes: {
				field: 'ui-form__field',
				fieldReq: 'required',
				fieldEr: 'error',
				errors: 'ui-errors',
				errorsItem: '__item',
				errorsType: '--type',
				errorsReq: '--required',
			},
			types: {
				email: {
					reg: /^([a-z0-9_\.-])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/i,
					text: 'Некорректный e-mail'
				},
				phone: {
					reg: /^(\+)?(\d{1,2})?[( .-]*(\d{1,3})[) .-]*(\d{1,4})[ .-]?(\d{1,4})$/,
					text: 'Некорректный номер телефона'
				}
			},
			onSend: () => {
				app.popups.thx(thxPopup);
				this.clear();
			}
		}, options);

		let _this = this,
			classes = this.options.classes;

		// add errors to fields
		form.find('.'+classes.fieldReq).each(function () {
			$(this).append(`<div class="${classes.errors}">
				<p class="${classes.errors+classes.errorsItem} ${classes.errors+classes.errorsItem+classes.errorsReq}">
					Обязательное поле
				</p>
			</div>`);
		});
	
		// add * to required fields
		form.find('.'+classes.fieldReq).each(function () {
			if ($(this).find('.ui-input__placeholder').length) {
				$(this).find('.ui-input__placeholder').append(' *');
			} else {
				$(this).find('input, textarea').each(function() {
					$(this).attr('placeholder', $(this).attr('placeholder') + ' *');
				});
			}
		});

		let sender = form.attr('action'),
			formType = form.attr('data-form-type'),
			thxPopup = form.attr('data-form-thxpopup') || 'thx';

		form
			.removeAttr('action')
			.removeAttr('data-form-type')
			.removeAttr('data-form-thxpopup');
	
		// check if is filled
		form.on('submit', function (e) {
			e.preventDefault();
	
			let valid = _this.validate(form);
	
			// if check passed
			if (valid) {
				let formData = new FormData(form.get(0));

				formData.append('formType', formType);
				
				$.ajax({
					type: 'POST',
					url: sender,
					dataType: 'json',
					processData: false,
					contentType: false,
					data: formData,
					success: function (data) {
						if (typeof _this.options.onSend == 'function') {
							_this.options.onSend.call();
						}
					},
					error: function (data) {
						console.log(data);
					}
				});
			}
			// if not passed
			else {
				form.find('.'+classes.fieldEr).first().find('input, textarea').focus();
			}
		});

		form.on('form.clear', function() {
			_this.clear();
		});
	
		form.data('formInit', true);
	}

	cl() {
		console.log(this.options);
	}

	clear() {
		let classes = this.options.classes;

		this.form
			.find('.'+classes.field)
				.removeClass(classes.fieldEr)
			.find('input, textarea')
				.val('')
				.trigger('change');
	}

	validate() {
		let _this = this,
			classes = this.options.classes,
			types = this.options.types,
			fields = this.form.find('.'+classes.fieldReq),
			valid = true;

		if (fields.length) {
			fields.each(function () {
				let field = $(this),
					fieldType = field.attr('data-field-type'),
					fieldVal;

				if (field.find('input').length) {
					fieldVal = field.find('input').val();
				} else {
					fieldVal = field.find('textarea').val();
				}

				field.find(classes.errors+classes.errorsItem+classes.errorsType).remove();

				if (!fieldVal) {
					field.addClass(classes.fieldEr);
					field.find('.'+classes.errors+classes.errorsItem+classes.errorsType).remove();
					field.find('.'+classes.errors+classes.errorsItem+classes.errorsReq).show();
					valid = false;
				} else {
					field.removeClass(classes.fieldEr);
					field.find('.'+classes.errors+classes.errorsItem+classes.errorsReq).hide();

					if (fieldType in types) {
						if (!types[fieldType].reg.test(fieldVal)) {
							field
								.addClass(classes.fieldEr)
								.find('.'+classes.errors)
									.append(`<p class="${classes.errors+classes.errorsItem+classes.errorsType}">${types[fieldType].text}</p>`);
									
							valid = false;
						} else {
							field
								.removeClass(classes.fieldEr)
								.find('.'+classes.errors+classes.errorsItem+classes.errorsType)
									.remove();
						}
					}
				}
			});
		}

		return valid;
	}
}