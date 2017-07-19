var COSS = {};

(function ($) {
    "use strict";
    
    $(function() {
        var slideIndex = 1;

        COSS.showPrevious = function(n){
            showSlides(slideIndex - n);
        }

        COSS.showNext = function(n){
            showSlides(slideIndex += n);
        }
        
        function showSlides(n){
            var i;
            var slides = document.getElementsByClassName("hero-slides");
        
            if(n>slides.length){
                slideIndex = 1;
            }
            if(n < 1){
                slideIndex = slides.length;
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none"; 
            }
            slides[slideIndex-1].style.display = "block"; 
        }
    });
 }(jQuery));