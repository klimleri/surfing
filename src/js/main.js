const loader = document.querySelector('.loader');
const progress = document.getElementById('progress');
const progressValue = document.getElementById('progress-value');
const imagesArray = [...document.querySelectorAll('.preload')];
const intro = document.querySelector('.js_intro');
const nav = document.querySelector('.nav');

const length = imagesArray.length;
let counter = 0, mySwiper, space, slides, sliderStart = false;

imagesArray.forEach(function(img) {
    if(img.complete)
        incrementCounter();
    else
        img.addEventListener('load', incrementCounter, false);
});

function incrementCounter() {
    counter++;
    const value = `${Math.floor(counter / length * 100)}%`;
    progress.style.width = value;
    progressValue.innerText = value;
    if (counter === length) {
        loader.classList.add('animate');
        intro.classList.add('animate_el');
    }
}

nav.addEventListener('click', function(e){
    if(e.target.tagName === "A") {
        const activeLink = [...nav.children].filter(el => el.classList.contains('active'));
        activeLink[0].classList.remove('active');
        e.target.classList.add('active');
    }
});

[...nav.children].forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

window.addEventListener('DOMContentLoaded', function () {
    const Swiper = require('swiper');
    const width = window.innerWidth;
    space = width > 1200 ? 90 : 30;
    slides = width > 767 ? 3 : 1;

    mySwiper = new Swiper('.swiper-container', {
        speed: 500,
        spaceBetween: space,
        slidesPerView: slides,
        slidesPerGroup: slides,
        loopFillGroupWithBlank: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    const videosArray = [...document.querySelectorAll('.js_video')];
    const playButtonsArray = [...document.querySelectorAll('.js_play')];

    playButtonsArray.forEach((btn, i) => btn.addEventListener('click', function () {
        btn.classList.add('hide');
        videosArray[i].play();
        videosArray[i].controls = true;
    }));
});