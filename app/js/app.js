'use strict';

(function () {
    $('.screenshots').owlCarousel({
        center: true,
        items: 2,
        startPosition: 1
    });

    $('.alternative-slider').owlCarousel({
        items: 3.5,
        startPosition: 1
    });

})();



$('.js-read-more-button').click(function () {

    var readmore = $(this).prev(".read-more"),
        readmoreHide = readmore.children(".read-more__wrapper"),
        readmoreHeight = readmoreHide.height(),
        $this = $(this);

    if (readmore.hasClass("hidden")){
        readmore.css('height', readmoreHeight);
        setTimeout(function(){
            readmore.removeClass("hidden");
            $this.addClass("display-none");
        }, 300)
    }
})