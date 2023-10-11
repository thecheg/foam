import '../modules/jquery/functions.js';

import '../../node_modules/ion-rangeslider/js/ion.rangeSlider.js';

import { device } from 'device.js';

import 'inputmask/dist/jquery.inputmask.js';

import { Swiper } from 'swiper/bundle';

import { Fancybox } from '@fancyapps/ui';

import { units } from '../modules/cheg.units/functions.js';

import { scrollTo } from '../modules/cheg.scrollto/functions.js';
import { scrollLock } from '../modules/cheg.scrolllock/functions.js';

import { tabs } from '../modules/cheg.tabs/functions.js';

import { popups } from '../modules/cheg.popups/functions.js';

import { Selects } from '../modules/cheg.selects/functions.js';

import { menu } from '../modules/cheg.menu/functions.js';

import { waypoint } from '../modules/cheg.waypoint/functions.js';

/*
 * Cheg UI 4.0.0
*/
window.app = {
	settings: {
		winWidth: 0,
		winHeight: 0,

		sbWidth: 0,

		scrollOffset: function() {
			return $('.header').outerHeight();
		},
		scrollPos: 0,
		popupOpened: false,
		scrollLockPos: 0,

		animDuration: 400,

		appLoaded: false,

		menuOpened: false,
		catalogOpened: false
	},
	deviceIs: device,

	/*
	 * Checking if media query matches
	*/
	matches(query) {
		return window.matchMedia(`(${query})`).matches
	},

	/*
	 * Scroll to hash on page laod
	*/
	toHash() {
		if (window.location.hash) {
			app.scrollTo(window.location.hash, {
				offset: app.settings.scrollOffset()
			});

			window.location.hash = '';
		}
	},

	header: {
		init() {
			app.waypoint({
				position: function() {
					let pos = 222;

					return pos;
				},
				onDown: function() {
					$('.app').addClass('app--scrolled');
					$('.fixed').addClass('fixed--s');
				},
				onUp: function() {
					$('.app').removeClass('app--scrolled');
					$('.fixed').removeClass('fixed--s');
				}
			});

			$('.menu-toggle').on('click', function() {
				let isCat = $(this).hasClass('catalog-toggle') ? true : false;
				
				if (app.matches('min-width:1024px')) {
					!app.settings.menuOpened ? app.menu.open() : app.menu.close();
				} else {

					if (isCat) {
						if (!app.settings.catalogOpened) {
							$('.app').addClass('app--catalog');
							app.settings.catalogOpened = true;
						} else {
							$('.app').removeClass('app--catalog');
							app.settings.catalogOpened = false;
						}
					} else {
						!app.settings.menuOpened ? app.menu.open() : app.menu.close();
					}
				}
			});

			this.menu();
		},
		menu() {
			let menu = $('.menu'),
				items = menu.find('.ui-sidemenu__item'),
				subs = menu.find('.ui-sidemenu__sub'),
				arrs = menu.find('.ui-sidemenu__arr'),
				menuF = $('.fixed-menu'),
				menuHead = $('.fixed-menu__text'),
				menuBack = $('.fixed-menu__back'),
				menuClose = $('.fixed-menu__close');

			items.on('mouseenter', function() {
				if (app.matches('min-width:1023px')) {
					let cat = $(this).attr('data-menu');
	
					items.removeClass('hover');
					subs.removeClass('active');
	
					$(this).addClass('hover');
					menu.find(`.ui-sidemenu__sub[data-menu="${cat}"]`).addClass('active');
				}
			});

			arrs.on('click', function() {
				if (app.matches('max-width:1024px')) {
					let item = $(this).closest('.ui-sidemenu__item'),
					cat = item.attr('data-menu'),
					text = item.find('.ui-sidemenu__link').text();

					subs.removeClass('active');

					menu.find(`.ui-sidemenu__sub[data-menu="${cat}"]`).addClass('active');

					menu.addClass('active');
					menuF.addClass('active');
					menuHead.text(text);
				}
			});

			menuClose.on('click', function() {
				$('.app').removeClass('app--catalog');
				app.settings.catalogOpened = false;
			});

			menuBack.on('click', function() {
				menu.removeClass('active');
				menuF.removeClass('active');
			});

			$('.menu .ui-sidemenu__item.current').trigger('mouseenter');
		},
	},

	/*
	 * Carousels
	*/
	carousel(block) {
		let slider = block.find('.ui-carousel__slider'),
			sliderS,
			opts = block.attr('data-carousel') ? JSON.parse(block.attr('data-carousel')) : {};

		opts = $.extend({
			slidesPerView: 'auto',
			loop: true,
			spaceBetween: 20,
			speed: 500,
			init: true,
			slideActiveClass: 'active',
			watchSlidesProgress: true,
			navigation: {
				nextEl: block.find('.ui-nav__item--n').get(0),
				prevEl: block.find('.ui-nav__item--p').get(0),
				disabledClass: 'disabled'
			},
		}, opts);

		sliderS = new Swiper(slider.get(0), opts);

		block.data('carouselInit', true);
	},

	/*
	 * Products
	*/
	product(block) {
		let sliders = block.find('.product__left-slider');

		sliders.each(function() {
			let slider = $(this),
				thumb = slider.find('.product__thumbs'),
					thumbS,
					thumbOpts = {
						loop: true,
						init: true,
						slidesPerView: 3,
						spaceBetween: 20,
						slideActiveClass: 'active',
						slideDuplicateActiveClass: 'active-duplicate',
						watchSlidesProgress: true,
					};
		
				thumbS = new Swiper(thumb.get(0), thumbOpts);
		
				let img = slider.find('.product__imgs'),
					imgS,
					imgOpts = {
						loop: true,
						init: true,
						slidesPerView: 1,
						spaceBetween: 0,
						slideActiveClass: 'active',
						slideDuplicateActiveClass: 'active-duplicate',
						watchSlidesProgress: true,
						thumbs: {
							swiper: thumbS,
							slideThumbActiveClass: 'active'
						},
					};
	
			imgS = new Swiper(img.get(0), imgOpts);
		});

		let add = block.find('.add--f');
		
		app.waypoint({
			position: function() {
				let pos = block.find('.product__right').offset().top + block.find('.product__right').outerHeight();
	
				return pos - 100;
			},
			onDown: function() {
				add.addClass('add--fv');
			},
			onUp: function() {
				add.removeClass('add--fv');
			}
		});

		block.data('productInit', true);
	},

	/*
	 * Quantity
	*/
	quantity(block) {
		let inp = block.find('.ui-quantity__inp input'),
			val = +inp.val(),
			min = +block.attr('data-min') || 1,
			max = +block.attr('data-max') || 999999;

		inp.on('change input paste keyup', function() {
			val = $(this).val();

			val = +(val.replace(/[^0-9]/g, ''));

			if (!val || val == '') {
				val = min;
			} else {
				if (val < min) {
					val = min;
				}

				if (val > max) {
					val = max;
				}
			}

			inp.val(val);
		});
		
		block.find('.ui-quantity__ctrl').on('click', function() {
			let type = $(this).attr('data-quantity');

			if (type == 'minus') {
				val -= 1;

				if (val < min) {
					val = min;
				}
			} else {
				val += 1;

				if (val > max) {
					val = max;
				}
			}

			inp.val(val).trigger('change');
		});

		block.data('quantityInit', true);
	},

	/*
	 * Catalog
	*/
	catalog: {
		init(block) {
			let _this = this,
				filters = block.find('.catalog__filter');
	
			filters.each(function() {
				if ($(this).find('.catalog__filter-list > li').length > 3) {
					$(this).addClass('cut');
				}
	
				$(this).find('.catalog__filter-more').on('click', function() {
					$(this).closest('.catalog__filter').addClass('active').removeClass('cut');
				});
			});

			block.find('.catalog__filters-btn').on('click', function() {
				$(this).closest('.catalog__filters').toggleClass('active');
			});

			_this.prices(block);
	
			block.data('catalogInit', true);
		},
		prices(block) {
			let range = block.find('.catalog__filter-price-range').find('input'),
				from = block.find('.catalog__filter-price-f'),
				to = block.find('.catalog__filter-price-t'),
				data;

			from.inputmask({
				alias: 'numeric',
				mask: 'от 9{1,} ₽',
				placeholder: ' ',
				rightAlign: false,
			});

			to.inputmask({
				alias: 'numeric',
				mask: 'до 9{1,} ₽',
				placeholder: ' ',
				rightAlign: false,
			})

			data = range.ionRangeSlider({
				type: 'double',
				onStart: function(data) {
					from.val(data.from);
					to.val(data.to);
				},
				onChange: function(data) {
					from.val(data.from);
					to.val(data.to);
				}
			}).data('ionRangeSlider');

			block.find('.catalog__filter-price-f, .catalog__filter-price-t').on('change paste input keypress', function() {
				let val = +$(this).val().replace(/[^0-9]/g, '');

				if ($(this).hasClass('catalog__filter-price-f')) {
					data.update({
						from: val
					})
				}

				if ($(this).hasClass('catalog__filter-price-t')) {
					data.update({
						to: val
					})
				}
			});
		}
	},








	units,

	menu,
	scrollTo,
	scrollLock,

	popups,

	tabs,

	Selects,

	waypoint,

	/*
	* Init
	*/
	init() {
		// * Units
		app.units.all();
	
		// * Tabs
		$('.ui-tabs').not('.custom').each(function () {
			if (!$(this).data('tabsInit')) {
				app.tabs.init($(this));
			}
		});
		app.tabs.bind();
	
		// * Tabs
		$('.ui-tabs').not('.custom').each(function () {
			if (!$(this).data('tabsInit')) {
				app.tabs.init($(this));
			}
		});
		app.tabs.bind();
	
		// * Popups
		$('.popup').each(function () {
			if (!$(this).data('popupsInit')) {
				app.popups.init($(this));
			}
		});
		app.popups.bind();
	
		// * Selects
		$('.ui-select').not('.custom').each(function () {
			if (!$(this).data('selectInit')) {
				let sel = new app.Selects($(this));
				//sel.cl();
			}
		});
	
		// * Carousels
		$('.ui-carousel').each(function () {
			if (!$(this).data('carouselInit')) {
				app.carousel($(this));
			}
		});
	
		// * Catalog
		$('.catalog').each(function () {
			if (!$(this).data('catalogInit')) {
				app.catalog.init($(this));
			}
		});
	
		// * Quantity
		$('.ui-quantity').each(function () {
			if (!$(this).data('quantityInit')) {
				app.quantity($(this));
			}
		});
	
		// * Products
		$('.product').each(function () {
			if (!$(this).data('productInit')) {
				app.product($(this));
			}
		});

		Fancybox.bind('[data-fancybox]', {
			backFocus: false
		});
	}
};

app.deviceIs.addClasses(document.documentElement);

Fancybox.defaults.Hash = false;
Fancybox.defaults.backFocus = false;

(function () {
	app.deviceIs.touch ? $('html').addClass('touch') : $('html').addClass('no-touch');

	app.settings.winWidth = $(window).width();
	app.settings.winHeight = $(window).height();
	app.settings.scrollPos = $(window).scrollTop();

	// * Init
	app.init();
	app.header.init();

	// app.popups.open('oneclickbuy');

	// * Menu binds
	//app.menu.bind();

	if (!app.deviceIs.touch) {
		$(document).on('mouseenter', '.brands__item, .catalog__category-item', function() {
			$(this).closest('.brands__list, .catalog__category-list').find('.brands__item, .catalog__category-item').not($(this)).addClass('hover');
		}).on('mouseleave', '.brands__item, .catalog__category-item', function() {
			$(this).closest('.brands__list, .catalog__category-list').find('.brands__item, .catalog__category-item').removeClass('hover');
		});
	}

	if (app.deviceIs.desktop) {
		$(window).on('resize', function () {
			app.units.all();
		});
	} else {

	}

	if (app.deviceIs.mobile || app.deviceIs.tablet) {
		$(window).on('orientationchange', function () {
			app.units.vh();
		}).on('resize', function () {
			app.units.mobile();
		});
	}

	$(window).on('resize', function () {
		app.settings.winWidth = $(window).width();
		app.settings.winHeight = $(window).height();
		app.settings.scrollPos = $(window).scrollTop();

		app.settings.menuOpened ? app.menu.close() : null;
	}).on('scroll', function () {
		app.settings.scrollPos = $(window).scrollTop();
	}).trigger('resize').trigger('scroll');

	// * Scroll to element
	$(document).on('click', 'a[href^="#"], [data-scrollto]', function (e) {
		e.preventDefault();
		let el = $(this).attr('href') || $(this).attr('data-scrollto');

		app.scrollTo(el, {
			offset: app.settings.scrollOffset()
		});
	});
})(jQuery);

$(window).on('load', function () {
	setTimeout(function () {
		// * hide preloader
		$('.preloader').fadeOut(1000, function () {
			$(this).remove();
		});
		$('.app').addClass('app--loaded');
		app.settings.appLoaded = true;
		$(window)
			.trigger('app.loaded')
			.trigger('scroll')
			.trigger('resize');
	}, 300);

	// * Lenis scroll
	if (window.Lenis && typeof window.Lenis == 'function' && !app.scroll.inited) {
		app.scroll.init();
	}

	// * Scroll to hash on page laod
	app.toHash();
});