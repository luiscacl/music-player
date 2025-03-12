const nextSong = document.querySelector(".controls-container .fa-forward");
const previousSong = document.querySelector(".controls-container .fa-backward");
const togglePlayPauseButton = document.querySelector(
  ".controls-container #play-pause-button"
);
const audio = document.querySelector("audio");
const musicImg = document.querySelector(".image-container img");
const songTitle = document.querySelector(".music-player-container .title");
const songAuthor = document.querySelector(".music-player-container .author");
const currentProgressionBar = document.querySelector(".current-progress-bar");
const totalProgressBar = document.querySelector(".total-progress-bar");
let currentTime = document.querySelector(".current-time");
const totalDuration = document.querySelector(".total-duration");

// Songs list
let songs = [
  {
    name: "Super Awesome",
    author: "The Phoenix Cat",
    id: 1,
    image:
      "https://res.cloudinary.com/dftslwu7s/image/upload/v1741799408/img1_weiyhh.jpg",
    song: "https://res.cloudinary.com/dftslwu7s/video/upload/v1741799594/1_rmlk8j.mp3",
  },
  {
    name: "Super Cool",
    author: "Artistic",
    id: 2,
    image:
      "https://res.cloudinary.com/dftslwu7s/image/upload/v1741799408/img2_a3hcru.jpg",
    song: "https://res.cloudinary.com/dftslwu7s/video/upload/v1741799597/2_crupax.mp3",
  },
  {
    name: "Super Glorius",
    author: "The Universe",
    id: 3,
    image:
      "https://res.cloudinary.com/dftslwu7s/image/upload/v1741799409/img3_hacra2.jpg",
    song: "https://res.cloudinary.com/dftslwu7s/video/upload/v1741799596/3_rf7ybh.mp3",
  },
];

// Render songs
let counterIndex = 0;
function renderSongs() {
  musicImg.src = songs[counterIndex].image;
  audio.src = songs[counterIndex].song;
  songTitle.textContent = songs[counterIndex].name;
  songAuthor.textContent = songs[counterIndex].author;
}

// Change next song
function changeNextSong() {
  ++counterIndex;
  // Check if theres no more songs
  if (counterIndex > songs.length - 1) {
    counterIndex = 0;
  }
  renderSongs();
  playPauseMusic();
}

// Change previous song
function changePreviousSong() {
  // Check if theres no more songs
  --counterIndex;
  if (counterIndex < 0) {
    counterIndex = songs.length - 1;
  }
  renderSongs();
  playPauseMusic();
}

// Play / Pause music
function playPauseMusic() {
  if (togglePlayPauseButton.classList.contains("fa-pause")) {
    audio.play();
  } else if (togglePlayPauseButton.classList.contains("fa-play")) {
    audio.pause();
  }
}

// Change button to play / pause music
function playPauseButton() {
  togglePlayPauseButton.classList.toggle("fa-play");
  togglePlayPauseButton.classList.toggle("fa-pause");
  playPauseMusic();
}

function updateProgressionBar() {
  let progressPorcentage = (audio.currentTime / audio.duration) * 100;
  if (!progressPorcentage) {
    currentProgressionBar.setAttribute("style", `width: 0%`);
    return;
  }

  currentProgressionBar.setAttribute("style", `width: ${progressPorcentage}%`);
}

function updateTotalSongTime() {
  let minutes = Math.floor(audio.duration / 60);
  let seconds = Math.floor(audio.duration - minutes * 60);
  if (seconds < 10) {
    seconds = `0${Math.floor(audio.duration - minutes * 60)}`;
  }
  totalDuration.textContent = `${minutes}:${seconds}`;
}

function updateCurrentTime() {
  // Es interesante ver cómo funciona el operador %
  let minutes = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime % 60);
  if (seconds % 60 < 10) {
    seconds = `0${Math.floor(audio.currentTime % 60)}`;
  }

  currentTime.textContent = `${minutes}:${seconds}`;
  updateProgressionBar();
}

function setProgressBarWhenClicking(event) {
  const progressBarWidth = this.clientWidth;
  const mouseClickX = event.offsetX;

  audio.currentTime = (mouseClickX / progressBarWidth) * audio.duration;
}

// Set progress bar event
totalProgressBar.addEventListener("click", setProgressBarWhenClicking);

// Play / Pause event
togglePlayPauseButton.addEventListener("click", playPauseButton);

// Load web page events
window.addEventListener("load", renderSongs);
window.addEventListener("load", updateProgressionBar);
window.addEventListener("load", () => {
  setTimeout(updateTotalSongTime, 0o250);
});

// Next song event
nextSong.addEventListener("click", changeNextSong);
previousSong.addEventListener("click", changePreviousSong);

// TimeUpdate event. Ayuda mucho para audios y videos
audio.addEventListener("timeupdate", updateCurrentTime);
audio.addEventListener("ended", changeNextSong);
audio.addEventListener("loadedmetadata", updateTotalSongTime);
