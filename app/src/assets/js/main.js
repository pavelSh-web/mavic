// //= ../libs/js/*.js
// //= modules/*.js
'use strict';
//= ../libs/js/jquery.js
//= ../libs/js/jquery-ui.js
//= ../libs/js/slick.js

//= modules/scrollTo.js


$('.header__logo').click(function () {
    console.log(1);
});

$('.questions-list').accordion();

$('.products-slider__box').slick({
    infinite: true,
    speed: 200,
    cssEase: 'linear',
    prevArrow: $('.products-slider__arrow_prev'),
    nextArrow: $('.products-slider__arrow_next'),
});