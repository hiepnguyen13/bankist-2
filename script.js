'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const header = document.querySelector('.header');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
///////////////////////////////////////

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookied for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', () => message.remove());

// Styles
message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Modal window

document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(tab => tab.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblingsEl = link.closest('.nav__links').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblingsEl.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation
const rootMargin = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const entry = entries[0]; //1 threshold --> 1 entry
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(stickyNav, {
  root: null, //default
  threshold: 0, //default
  rootMargin: `-${rootMargin}px`,
});

navObserver.observe(header);

///////////////////////////////////////
// Reveal section
const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const entry = entries[0];
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, {
  threshold: 0.15,
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionsObserver.observe(section);
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const lazyLoading = (entries, observer) => {
  const entry = entries[0];
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgsObserver = new IntersectionObserver(lazyLoading, {
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgsObserver.observe(img));

///////////////////////////////////////
// Slider

let curSlide = 0;
const maxSlide = slides.length;

const createDots = () => {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activeDot = curSlide => {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  document.querySelector(`.dots__dot[data-slide="${curSlide}"]`).classList.add('dots__dot--active');
};

const goToSlide = curSlide => {
  slides.forEach((slide, i) => (slide.style.transform = `translateX(${(i - curSlide) * 100}%)`));
};

const nextSlide = () => {
  if (curSlide === maxSlide - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
  activeDot(curSlide);
};

const prevSlide = () => {
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;

  goToSlide(curSlide);
  activeDot(curSlide);
};

// Apply
createDots();
goToSlide(curSlide);
activeDot(curSlide);

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activeDot(slide);
  }
});
