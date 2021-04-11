(function vinylMasters() {
  window.addEventListener('resize', () => {
    document.body.height = window.innerHeight;
  });

  const form = document.querySelector('#form');
  const codeInput = document.querySelector('#code-input');
  const theGoods = document.querySelector('#hires');
  const listenLink = document.querySelector('.listen');
  const audioplayerContainter = document.querySelector('#audioplayerContainter');
  const hiresInfo = document.querySelector('#hires-info');

  function verifyCode(e) {
    const promoCode = codeInput.value.toUpperCase();
    if (promoCode === 'HIRES') {
      theGoods.className = 'show';
      form.className = 'hide';
      e.preventDefault();
    } else {
      Swal.fire('sorry no');
      e.preventDefault();
    }
  }

  form.addEventListener('submit', verifyCode);

  listenLink.addEventListener('click', () => {
    audioplayerContainter.style.display = 'block';
    hiresInfo.style.display = 'none';
    listenLink.style.display = 'none';
  });

  const audioPlayer = document.querySelector('#audioPlayer');
  const tracks = document.querySelectorAll('li a');

  function play(e) {
    e.preventDefault();
    audioPlayer.src = this;
    audioPlayer.play();
  }

  for (let i = 0; i < tracks.length; i += 1) {
    tracks[i].addEventListener('click', play);
  }

  function playNext() {
    for (let i = 0; i < tracks.length; i += 1) {
      if (tracks[i] == audioPlayer.src) {
        audioPlayer.src = tracks[(i += 1)];
        audioPlayer.play();
      }
    }
  }

  audioPlayer.addEventListener('ended', playNext);
})();
