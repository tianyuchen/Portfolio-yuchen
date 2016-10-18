(function($) {
	

	skel.breakpoints({
		wide: '(max-width: 1920px)',
		normal: '(max-width: 1680px)',
		narrow: '(max-width: 1280px)',
		narrower: '(max-width: 1000px)',
		mobile: '(max-width: 736px)',
		mobilenarrow: '(max-width: 480px)',
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$all = $body.add($header);

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 0);
			});

		// Clear transitioning state on unload/hide.
			$window.on('unload pagehide', function() {
				window.setTimeout(function() {
					$('.is-transitioning').removeClass('is-transitioning');
				}, 250);
			});

		// Touch mode.
			skel.on('change', function() {

				if (skel.vars.mobile || skel.breakpoint('mobile').active)
					$body.addClass('is-touch');
				else
					$body.removeClass('is-touch');

			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Gallery.
			$window.on('load', function() {
				$('.gallery').poptrox({
					baseZIndex: 10001,
					useBodyOverflow: false,
					usePopupEasyClose: false,
					overlayColor: '#1f2328',
					overlayOpacity: 0.65,
					usePopupDefaultStyling: false,
					usePopupCaption: true,
					popupLoaderText: '',
					windowMargin: (skel.breakpoint('mobile').active ? 5 : 50),
					usePopupNav: true
				});
			});

		// Scrolly.
			$('.scrolly')
				.scrolly({
					speed: 1500,
					offset: $header.outerHeight()
				});
		
		// Tiles.
			var $tiles = $('.tiles > article');

			$tiles.each(function() {

				var $this = $(this),
					$image = $this.find('.image'), $img = $image.find('img'),
					$link = $this.find('.link'),
					$major = $this.find('.major'),
					x;
					
				// Image.

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Set position.
						if (x = $img.data('position'))
							$image.css('background-position', x);

					// Hide original image.
						$image.hide();

				// Text 	
				
					//Mouseover effect: Show/Hide h3 & p
						$major.hide();
						$this.mouseover(function() {
							$major.show();
						});

						$this.mouseout(function() {
							$major.hide();
						});
						
				// Link.
					if ($link.length > 0) {

						$x = $link.clone()
							.text('')
							.addClass('primary')
							.appendTo($this);

						$link = $link.add($x);

						$link.on('click', function(event) {

							var href = $link.attr('href');

							// Prevent default.
								event.stopPropagation();
								event.preventDefault();

							// Start transitioning.
								$this.addClass('is-transitioning');
								$wrapper.addClass('is-transitioning');

							// Redirect.
								window.setTimeout(function() {
									if ($link.attr('target') == '_blank')
										window.open(href);
									else
										location.href = href;
								}, 500);
						});
					}
			});

			//Mouseover effect: add filter, size bigger 
			$('a.link').mouseover(function(){
				$(this).parent().animate({"backgroundSize":"105vh"}, 600)
			}).mouseout(function(){
				$(this).parent().animate({"backgroundSize":"100vh"}, 300)
			})
		
		
		// Section transitions.
			if (!skel.vars.mobile
			&&	skel.canUse('transition')) {

				var on = function() {

					// Generic sections.
						$('.main.style1')
							.scrollex({
								mode:		'middle',
								delay:		100,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

						$('.main.style2')
							.scrollex({
								mode:		'middle',
								delay:		100,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

					// Work.
						$('#work')
							.scrollex({
								top:		'40vh',
								bottom:		'30vh',
								delay:		50,
								initialize:	function() {

												var t = $(this);

												t.find('.row.images')
													.addClass('inactive');

											},
								terminate:	function() {

												var t = $(this);

												t.find('.row.images')
													.removeClass('inactive');

											},
								enter:		function() {

												var t = $(this),
													rows = t.find('.row.images'),
													length = rows.length,
													n = 0;

												rows.each(function() {
													var row = $(this);
													window.setTimeout(function() {
														row.removeClass('inactive');
													}, 100 * (length - n++));
												});

											},
								leave:		function(t) {

												var t = $(this),
													rows = t.find('.row.images'),
													length = rows.length,
													n = 0;

												rows.each(function() {
													var row = $(this);
													window.setTimeout(function() {
														row.addClass('inactive');
													}, 100 * (length - n++));
												});

											}
							});

							
							
					// Contact.
						$('#contact')
							.scrollex({
								top:		'50%',
								delay:		50,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

				};

				var off = function() {

					// Generic sections.
						$('.main.style1')
							.unscrollex();

						$('.main.style2')
							.unscrollex();

					// Work.
						$('#work')
							.unscrollex();

					// Contact.
						$('#contact')
							.unscrollex();

				};

				skel.on('change', function() {

					if (skel.breakpoint('mobile').active)
						(off)();
					else
						(on)();

				});

			}

		// Events.
			var resizeTimeout, resizeScrollTimeout;

			$window
				.resize(function() {

					// Disable animations/transitions.
						$body.addClass('is-resizing');

					window.clearTimeout(resizeTimeout);

					resizeTimeout = window.setTimeout(function() {

						// Update scrolly links.
							$('a[href^=#]').scrolly({
								speed: 1500,
								offset: $header.outerHeight() - 1
							});

						// Re-enable animations/transitions.
							window.setTimeout(function() {
								$body.removeClass('is-resizing');
								$window.trigger('scroll');
							}, 0);

					}, 100);

				})
				.load(function() {
					$window.trigger('resize');
				});

	});

	var lastScrollTop = 0;
	$(window).scroll(function(event){
	   var st = $(this).scrollTop();
	   if (st > lastScrollTop){
	       // downscroll code
	       $('#header').css({'opacity':0})
	   } else {
	      // upscroll code
	      $('#header').css({'opacity':1})
	   }
	   lastScrollTop = st;
	});

})(jQuery);
