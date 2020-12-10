$(function(){
	$('.catalog.wide_menu .with_right_block.BANNER .menu-type-3 > li > .dropdown-menu').hide();
	var $menuItems = $('.catalog.wide_menu .menu-type-3 > li');
	$('.catalog.wide_menu .menu-type-3 > li').on('mouseenter', function(e){
		e.stopPropagation();
		if (!$(this).hasClass('m-active')) {
			$menuItems.removeClass('m-active');
			$(this).addClass('m-active');
		}
	}).eq(0).trigger('mouseenter');
	$('.catalog.wide_menu .with_right_block.BANNER .menu-type-3 a[href="javascript:;"]').addClass('m-nolink');

	var $menu = $('.catalog.wide_menu .with_right_block.BANNER .menu-type-3');
	var waitInterval = setInterval(function(){
		if ($menu.is(':visible')) {
			clearInterval(waitInterval);
			$('.catalog.wide_menu .with_right_block.BANNER .menu-type-3 .more_items').trigger('click');
			setTimeout(function(){
				if ($('.catalog.wide_menu .with_right_block.BANNER .menu-type-3 > li').length * 75 < $menu.parents('.BANNER').height()) {
					$('.catalog.wide_menu #mCSB_1_scrollbar_vertical').css('visibility', 'hidden')
				} else {
					setInterval(function(){
						var $wrap = $('.catalog.wide_menu #mCSB_1_container'),
						$firstLi = $menu.find('>li:eq(0)');
						var top = $wrap.css('top').replace('px', '');
						$('.catalog.wide_menu .with_right_block.BANNER .right-side').css('margin-top', (top * -1) + 40);
						$('.catalog.wide_menu .with_right_block.BANNER .menu-type-3 > li > ul').css('margin-top', (top * -1));
						//$wrap.css('transform', 'translateY('+(top * -1)+')');
						//$firstLi.css('margin-top', top);
					}, 20);
				}
			}, 500);

		}
	}, 200);


});