
const listenToHamburgerMenu = function(){

    console.log(document.querySelector(".js-nav__hamburger-checkbox").checked);
    if(document.querySelector(".js-nav__hamburger-checkbox").checked){
        document.querySelector(".js-nav__hamburger-slider").classList.add("c-nav__hamburger-menu");
        document.querySelector(".js-nav__hamburger-slider").classList.remove("u-hidden");
        document.querySelector('.js-nav__hamburger-slider').style.opacity = "";
        
    }
    else{
        
        document.querySelector(".js-nav__hamburger-slider").classList.add("u-hidden");  
        document.querySelector(".js-nav__hamburger-slider").classList.remove("c-nav__hamburger-menu");  
    }

}


const init = function() {
    document.querySelector(".js-nav__hamburger-slider").classList.add("u-hidden");
    document.querySelector(".js-nav__hamburger-checkbox").addEventListener("click", listenToHamburgerMenu);
};

document.addEventListener("DOMContentLoaded", init);