// modules
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import animation from './modules/animation';

// init modules
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();

let arrAnimationEl = document.querySelectorAll('h2:not(.result__title), h1, .intro__date')
arrAnimationEl.forEach(el => {
    animation(el, {
        name: 'fadeInUp',
        delay: 500,
        duration: 600
    });
})

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();

window.addEventListener('load', (e) => {
    document.body.classList.add('loaded')
})