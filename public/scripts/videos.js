(function videos() {
  function ready() {
    const videoPlayer = document.querySelector('iframe');
    const titles = document.querySelectorAll('.titles');
    const carouselMarkers = document.querySelectorAll('.carousel-markers');
    document.querySelector('.titles:first-of-type').classList.add('is-visible');

    const show = elem => {
      elem.classList.add('is-visible');
    };

    const hide = elem => {
      elem.classList.remove('is-visible');
    };

    const carouselSelected = elem => {
      elem.classList.add('carousel-selected');
    };

    const carouselClear = elem => {
      elem.classList.remove('carousel-selected');
    };

    function arrowScrollRight() {
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < titles.length; i += 1) {
        if (
          titles[i].classList.value.includes('is-visible') &&
          titles[i].nextElementSibling !== null
        ) {
          hide(titles[i]);
          show(titles[i].nextElementSibling);
          carouselClear(carouselMarkers[i]);
          carouselSelected(carouselMarkers[i].nextElementSibling);
          videoPlayer.src = titles[i].nextElementSibling.attributes.src.value;
          break;
        }
      }
    }

    function arrowScrollLeft() {
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < titles.length; i += 1) {
        if (
          titles[i].classList.value.includes('is-visible') &&
          titles[i].previousElementSibling !== null
        ) {
          hide(titles[i]);
          show(titles[i].previousElementSibling);
          carouselClear(carouselMarkers[i]);
          carouselSelected(carouselMarkers[i].previousElementSibling);
          videoPlayer.src = titles[i].previousElementSibling.attributes.src.value;
          break;
        }
      }
    }

    document
      .querySelector('.fa-arrow-alt-circle-right')
      .addEventListener('click', arrowScrollRight);
    document.querySelector('.fa-arrow-alt-circle-left').addEventListener('click', arrowScrollLeft);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
