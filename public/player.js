const audioPlayer = document.querySelector("#audioPlayer");
const playlist = document.querySelector("#playlist");
const tracks = document.querySelectorAll("a");

function play(e) {
  e.preventDefault();
  audioPlayer.src = this;
  audioPlayer.play();
}

for (track of tracks) {
  track.addEventListener("click", play);
}

function playNext(e) {
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i] == audioPlayer.src) {
      audioPlayer.src = tracks[++i];
      audioPlayer.play();
    }
  }
}

audioPlayer.addEventListener("ended", playNext);