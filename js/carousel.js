var COSS = {};

(function ($) {
    "use strict";
    
    $(function() {
        var slideIndex = 1;
        var btnN = document.getElementById("nextBtn");
        var btnP = document.getElementById("prevBtn");
        
        var timer;
        var delay = 1000;

        $('#prevBtn').hover(function() {
            // on mouse in, start a timeout

            timer = setTimeout(function() {
                // do your stuff here
                btnP.style.display="block";
            }, delay);
        }, function() {
            // on mouse out, cancel the timer
            btnP.style.display="none";
            clearTimeout(timer);
        });
        
        COSS.showPrevious = function(n){
            showSlides(slideIndex - n);
            alert("previous!");
        }

        COSS.showNext = function(n){
            showSlides(slideIndex += n);
        }
        
        COSS.autoRotate = function(n){
            while(true){
                showSlides(slideIndex += n);
                setTimeout(autoRotate, n)
            }
        }
        
        COSS.show = function(n){
            var i;
            var slides = document.getElementsByClassName("hero-slides");
            var dots = document.getElementsByClassName("navdot");
                        
            for(i = 0; i < dots.length; i++){
                dots[i].className = dots[i].className.replace(" active", "");
            }
            
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none"; 
            }
            
            slides[n-1].style.display = "block"; 
            dots[n-1].className += " active";
        }
        
        COSS.showPrevBtn = function(){  
            btnP.style.display="block";
        }
        
        COSS.hidePrevBtn = function(){
            btnP.style.display="none";
        }
        
        COSS.showNextBtn = function(){
            btnN.style.display="block";
        }
        
        COSS.hideNextBtn = function(){
            btnN.style.display="none";
        }
        
        function showSlides(n){
            var i;
            var slides = document.getElementsByClassName("hero-slides");
            var dots = document.getElementsByClassName("navdot");
        
            if(n>slides.length){
                slideIndex = 1;
            }
            if(n < 1){
                slideIndex = slides.length;
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none"; 
            }
            
            for(i = 0; i < dots.length; i++){
                dots[i].className = dots[i].className.replace("active", "");
            }
            slides[slideIndex-1].style.display = "block";
            dots[slideIndex-1].className += " active";
        }
        
        setInterval(function () {COSS.showNext(1)}, 10000);
    });
 }(jQuery));
