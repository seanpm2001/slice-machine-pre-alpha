"use strict";
var util = {
  keyCodes: {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    HOME: 36,
    END: 35,
    ENTER: 13,
    SPACE: 32,
    DELETE: 46,
    TAB: 9
  },

  generateID: function (base) {
    return base + Math.floor(Math.random() * 999);
  }

};



(function (w, doc, undefined) {

  var ARIAcarouselOptions = {

  }

  var ARIAcarousel = function (inst, options) {
    const _options = Object.assign(ARIAcarouselOptions, options);
    const el = inst;
    const carouselContainer = el.querySelector("[data-carousel-cards]");
    const cardsWrapper = el.querySelector("[data-carousel-cards-wrapper]");
    const cards = Array.from(el.querySelectorAll("[data-carousel-card]"));
    const paddleNav = el.querySelector("[data-carousel-paddleNav]");
    const prevButton = paddleNav.querySelector('[data-prev]');
    const nextButton = paddleNav.querySelector('[data-next]');

    const carouselID = util.generateID('c-carousel-');

    let cardWidth = cards[0].offsetWidth;
    let containerWidth = carouselContainer.offsetWidth;
    let itemsInView = Math.floor(containerWidth / cardWidth);
    let itemsOutOfView = cards.length - itemsInView;
    let rightCounter = itemsOutOfView; // counts the number of remaining slides that are out of view
    let leftCounter = 0;

    console.log('card width: ' + cardWidth);
    console.log('Items in view: ' + itemsInView);
    console.log('Items out of view: ' + itemsOutOfView);


    var init = function () {
      el.setAttribute('id', carouselID);
      el.classList.add('js-carousel');

      el.setAttribute('role', 'group'); // or region
      el.setAttribute('aria-roledescription', 'Carousel');
      el.setAttribute('aria-label', el.getAttribute('data-aria-label'));

      // show Next and Prev Buttons
      paddleNav.removeAttribute('hidden');

      setupPaddleNav();
      // setupSlides();

      // setupSRHelper();

      // enableTouchSwipes();
    };

    var enableTouchSwipes = function () {
      var mc = new Hammer(slidesWrapper, { threshold: 500 });
      // listen to events...
      mc.on("swipeleft", function (e) {
        paddleForward();
      });

      mc.on("swiperight", function (e) {
        paddleBack();
      });
    }

    // var setupSRHelper = function () {
    //   let helper = document.createElement('span');
    //   helper.setAttribute('aria-live', 'polite');
    //   helper.setAttribute('id', sliderID + '__SRHelper');
    //   helper.classList.add('sr-only');
    //   helper.classList.add('c-carousel__SRHelper');

    //   el.prepend(helper);


    //   updateHelper();
    // }

    // var updateHelper = function () {
    //   let showing = slides[currentIndex].getAttribute('data-slide-label');
    //   let showingNb = currentIndex + 1;
    //   let helper = el.querySelector('.c-carousel__SRHelper');
    //   helper.innerHTML = 'Showing ' + showing + ', slide ' + showingNb + ' of ' + slides.length;
    // }

    var setupPaddleNav = function () {

      prevButton.addEventListener('keydown', (e) => {
        paddleKeyboardRespond(e);
        // updateHelper();
      }, false);

      nextButton.addEventListener('keydown', (e) => {
        paddleKeyboardRespond(e);
        // updateHelper();
      }, false);

      prevButton.addEventListener('click', function (e) {
        paddleBack();
        // updateHelper();
      });

      nextButton.addEventListener('click', function (e) {
        paddleForward(e);
        // updateHelper();
      });

      handlePaddleButtonsState();
    }

    var handlePaddleButtonsState = function () {
      if (rightCounter == 0) {
        nextButton.setAttribute('aria-disabled', 'true');
        nextButton.setAttribute('tabindex', '-1');
      }
      else if (rightCounter > 0) {
        nextButton.removeAttribute('aria-disabled');
        nextButton.removeAttribute('tabindex');
      }

      if (leftCounter == 0) {
        prevButton.setAttribute('aria-disabled', 'true');
        prevButton.setAttribute('tabindex', '-1');
      }
      else if (leftCounter > 0) {
        prevButton.removeAttribute('aria-disabled');
        prevButton.removeAttribute('tabindex');
      }
    }


    var setupSlides = function () {
      slides.forEach((slide, index) => {

        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'Slide');

        slide.setAttribute('tabindex', '-1');
        slide.setAttribute('data-hidden', 'true');

        slide.addEventListener('keydown', (e) => {
          // slideKeyboardRespond(e);
        }, false);

        slide.addEventListener("blur", () => {
          slide.setAttribute('tabindex', '-1');
        }, false);
      });

      slideCards();
    }

    // var slideCards = function () {
    //   slides.forEach((slide, index) => {
    //     slide.setAttribute('data-hidden', 'true');
    //     slide.removeAttribute('tabindex');
    //   });

    //   slides[currentIndex].setAttribute('data-hidden', 'false');
    //   slides[currentIndex].setAttribute('tabindex', '0');
    //   slide(currentIndex);
    // }

    var slideCards = function () {
      var translateValue = leftCounter * cardWidth * -1;
      cardsWrapper.style.transform = 'translateX(' + translateValue + 'px)';
    }

    var incrementRightCounter = function () {
      if (rightCounter < itemsOutOfView) {
        return ++rightCounter;
        // rightCounter = rightCounter + 1;
      }
      else return;
    }

    var decrementRightCounter = function () {
      if (rightCounter > 0) {
        return --rightCounter;
      }
      else return;
    }

    var incrementLeftCounter = function () {
      if (leftCounter < itemsOutOfView) {
        return ++leftCounter;
      }
      else return;
    }

    var decrementLeftCounter = function () {
      if (leftCounter > 0) {
        return --leftCounter;
      }
      else return;
    }

    var paddleBack = function (e) {
      incrementRightCounter();
      decrementLeftCounter();
      slideCards();
      handlePaddleButtonsState();
    }

    var paddleForward = function (e) {
      decrementRightCounter();
      incrementLeftCounter();
      slideCards();
      handlePaddleButtonsState();
    }


    var paddleKeyboardRespond = function (e) {

      var keyCode = e.keyCode || e.which;

      switch (keyCode) {
        case util.keyCodes.LEFT:
          prevButton.focus();
          paddleBack(e);
          break;


        case util.keyCodes.RIGHT:
          nextButton.focus();
          paddleForward(e);
          break;


        case util.keyCodes.ENTER:
        case util.keyCodes.SPACE:
          // selectedDot = currentIndex;
          // selectDot();
          break;


        case util.keyCodes.TAB:
          // slides[selectedDot].setAttribute('tabindex', '0');
          // currentIndex = selectedDot;
          break;
      }

    }

    init.call(this);
    return this;
  }; // ARIAcarousel()

  w.ARIAcarousel = ARIAcarousel;

})(window, document);




var carouselInstance = "[data-carousel]";
var els = document.querySelectorAll(carouselInstance);
var allcarousel = [];

// window.addEventListener("resize", function (event) {
//   // update your variables
//   cardWidth = cards[0].offsetWidth;
//   containerWidth = carouselContainer.offsetWidth;
//   itemsInView = Math.floor(containerWidth / cardWidth);
// });

// Generate all carousel instances
for (var i = 0; i < els.length; i++) {
  var ncarousel = new ARIAcarousel(els[i]); // if manual is set to false, the carousel open on focus without needing an ENTER or SPACE press
  allcarousel.push(ncarousel);
}
