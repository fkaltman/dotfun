(function videos() {
  function ready() {
    const videoPlayer = document.querySelector('iframe');
    const titles = document.querySelectorAll('.titles');
    document.querySelector('.titles:first-of-type').classList.add('is-visible');

    const show = elem => {
      elem.classList.add('is-visible');
    };

    const hide = elem => {
      elem.classList.remove('is-visible');
    };

    function arrowScrollRight() {
      // eslint-disable-next-line no-restricted-syntax
      for (title of titles) {
        if (title.classList.value.includes('is-visible') && title.nextElementSibling !== null) {
          hide(title);
          show(title.nextElementSibling);
          videoPlayer.src = title.nextElementSibling.attributes.src.value;
          break;
        }
      }
    }

    function arrowScrollLeft() {
      // eslint-disable-next-line no-restricted-syntax
      for (title of titles) {
        if (title.classList.value.includes('is-visible') && title.previousElementSibling !== null) {
          hide(title);
          show(title.previousElementSibling);
          videoPlayer.src = title.previousElementSibling.attributes.src.value;
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
