import throttle from 'lodash/throttle';
// import setTimer from './setTimer'

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;
    this.startTime = null;
    this.timerStartFlag = false;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);
    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const lastScreen = this.activeScreen
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay(lastScreen);
  }

  changePageDisplay(lastScreen) {
    this.changeActiveMenuItem();        
    if(lastScreen === 1 && this.activeScreen === 2) {
      this.transformPage();
      setTimeout(()=> {
        this.changeVisibilityDisplay();
      }, 350)
    } else {
      this.changeVisibilityDisplay();
    }
    this.emitChangeDisplayEvent();
  }

  transformPage() {
    const page = document.querySelector('.page-content')
    page.classList.add('transform')
    setTimeout(() => {
      page.classList.remove('transform')
    }, 500);
  }

  timer(secondFromEnd) {
    const tick = () => {
      const tack = (timePassed) => {
        if(!this.timerStartFlag) {
          this.startTime = timePassed
          this.timerStartFlag = true
        } else {
          const timerMinutesElem = document.querySelector('.game__counter span:first-child')
          const timerSecondElem = document.querySelector('.game__counter span:last-child')
          const remainingTime = secondFromEnd * 1000 - Math.round(timePassed - this.startTime)
          if(remainingTime > 100) {
            timerMinutesElem.textContent = 
              Math.floor(remainingTime / (60 * 1000)) < 10
                ? `0${Math.floor(remainingTime / (60 * 1000))}`
                : `${Math.floor(remainingTime / (60 * 1000))}`
        
            timerSecondElem.textContent =
              Math.floor(remainingTime % (60 * 1000)) / 1000 < 10
                ? `0${Math.floor(Math.floor(remainingTime % (60 * 1000)) / 1000)}`
                : `${Math.floor(Math.floor(remainingTime % (60 * 1000)) / 1000)}`
          }
        }
      }
      requestAnimationFrame(tack);
      const start = Math.round(performance.now() - this.startTime + 100)
  
      if(start <= secondFromEnd * 1000) {
        requestAnimationFrame(tick);
      } else {
        console.log('time out')
      }
    }
    tick()
  }

  counter(elem, countStart = 0, countEnd = 99, countStep = 1, frame = 12) {
    let countCurrent = countStart
    let startCounter = Date.now()
    const wrapper = () => {
      const itter = (timePassed) => {
        if(Date.now() - startCounter >= Math.round(1000 / frame)) {
          elem.textContent = `${countCurrent}`
          countCurrent += countStep
          startCounter = Date.now()
        }
      }
      requestAnimationFrame(itter)
      if(countCurrent <= countEnd) {
        requestAnimationFrame(wrapper)
      } else {
        elem.textContent = `${countEnd}`
      }
    }
    wrapper()
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
      document.querySelector('body').dataset.activeScreen = activeItem.dataset.href
      if (activeItem.dataset.href === 'story' && !document.querySelector('.page-header__nav').dataset.slide) {
        document.querySelector('.page-header__nav').dataset.slide = 0
      }
    }
    console.log('activeItem.dataset.href', activeItem.dataset.href)
    switch (activeItem.dataset.href) {
      case 'prizes':
        const animationElement = document.querySelector('animate');
        const prizeJourneys = document.querySelector('.prizes__item--journeys')
        const prizeCases = document.querySelector('.prizes__item--cases')
        const prizeCodes = document.querySelector('.prizes__item--codes')
        setTimeout(() => {
          animationElement.beginElement();
          setTimeout(() => {
            prizeJourneys.querySelector('.prizes__desc > span').classList.add('show')
            prizeJourneys.querySelector('.prizes__desc > b').classList.add('show')
            setTimeout(() => {
              prizeCases.querySelector('.prizes__desc > span').classList.add('show')
              prizeCases.querySelector('.prizes__desc b').classList.add('show')
              this.counter(prizeCases.querySelector('.prizes__desc > b'), 1, 7, 1, 12)
              prizeCases.querySelector('.prizes__desc > b').style.maxWidth = 'unset'
              setTimeout(() => {
                prizeCodes.querySelector('.prizes__desc > span:not(.count-wrapper)').classList.add('show')
                prizeCodes.querySelector('.prizes__desc b').classList.add('show')
                this.counter(prizeCodes.querySelector('.prizes__desc > b'), 11, 900, Math.floor((Math.random() + 5) * 21), 12)
              }, 1000)
            }, 1000)
          }, 2400)
          
          
          // window.addEventListener('mySpecialEvent', function() {
            // }, false);
          }, 600)
        setTimeout(() => {
          document.querySelector('.prizes__item--journeys').classList.add('animation-finish')
        }, 3150)
        break
      case 'game':
        this.timer(300);
        break
      default:
        console.log('def');
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
