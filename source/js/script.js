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
animation(document.querySelector('.intro__title'), {
    name: 'fadeInUp',
    printingOrder: [[[4,2,1,2,3,2,1,5,3,1,3,1]], [[4,5,3,1,4,1]]],
    delay: 500,
    duration: 600
});

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();

window.addEventListener('load', (e) => {
    document.body.classList.add('loaded')
})