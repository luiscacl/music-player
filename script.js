/* PROBLEMAS EN ESTE EJERCICIO 
1° Obtener los archivos de una carpeta de visual Studio Code. Cuando quería cambiar de imagen o canción al darle click a next / previous song
pensé que sería buena idea usar una api o para obtener en un arreglo todas las imágenes / canciones de alguna carpeta, pero no fué posible.
Investigué que para manipular carpetas del dispositivo en js se tiene que usar node.js. Luego tuve la idea de iterar en los nombres de cada
cancion poniéndolos en un arreglo con un número como id, pero no funcionó, ya que para parar esa iteración tenía que ocurrir un error en la 
página web donde se señalaba que la canción no fue encontrada, además era código asíncrono, el cual solo se iba a ejecutar al momento que
cargara la página y nos señalaran hasta qué id de las canciones se cargaron.
Para esto encontré 2 soluciones: Una era usar una api para obtener las imágenes y canciones en formato json. Otra que se usó en el curso
fué crear un arreglo de objetos con las canciones que se tienen en las carpetas, lo cual es ineficiente 

2° Ejecutar el codigo asincrono. A veces era difícil saber en que momento se tenía que ejecutar el settimeout, ya fuera en una parte o en toda
la función. Pero a prueba y error se vió en donde funcionó colocarlo. Esto me pasó con la funcion que actualizaba el tiempo de la canción*/


// DOM elements
const nextSong = document.querySelector('.controls-container .fa-forward');
const previousSong = document.querySelector('.controls-container .fa-backward');
const togglePlayPauseButton = document.querySelector('.controls-container #play-pause-button');
const audio = document.querySelector('audio');
const musicImg = document.querySelector('.image-container img');
const songTitle = document.querySelector('.music-player-container .title');
const songAuthor = document.querySelector('.music-player-container .author');
const currentProgressionBar = document.querySelector('.current-progress-bar');
const totalProgressBar = document.querySelector('.total-progress-bar');
let currentTime = document.querySelector('.current-time');
const totalDuration = document.querySelector('.total-duration');

console.log(musicImg);

// Songs list
let songs = [
    {
        name: 'Super Awesome',
        author: 'The Phoenix Cat',
        id: 1
    },
    {
        name: 'Super Cool',
        author: 'Artistic',
        id: 2
    },
    {
        name: 'Super Glorius',
        author: 'The Universe',
        id: 3
    }
];

// Render songs
let counterIndex = 0;
function renderSongs(){
    musicImg.src = `/8°Music-Player/images/img${songs[counterIndex].id}.jpg`;
    audio.src = `/8°Music-Player/music/${songs[counterIndex].id}.mp3`;
    songTitle.textContent = songs[counterIndex].name;
    songAuthor.textContent = songs[counterIndex].author;
}

// Change next song
function changeNextSong(){
    ++counterIndex;
    // Check if theres no more songs
    if(counterIndex > songs.length - 1){
        counterIndex = 0;
    }
    renderSongs();
    playPauseMusic();
    setTimeout(updateTotalSongTime,0250);

    console.log(counterIndex);
}

// Change previous song
function changePreviousSong(){
    // Check if theres no more songs
    --counterIndex;
    if(counterIndex < 0){
        counterIndex = songs.length - 1;
    }
    renderSongs();
    playPauseMusic();
    setTimeout(updateTotalSongTime,0250);
}

// Play / Pause music
function playPauseMusic(){
    if(togglePlayPauseButton.classList.contains('fa-pause')){
        audio.play();
    } else if(togglePlayPauseButton.classList.contains('fa-play')){
        audio.pause();
    }
}

// Change button to play / pause music
function playPauseButton(){
    togglePlayPauseButton.classList.toggle('fa-play');
    togglePlayPauseButton.classList.toggle('fa-pause');
    playPauseMusic();
}

// PROGRESION BAR -----------------------------------------------------------------------------------------------------------------------------
function updateProgressionBar(){
    let progressPorcentage = (audio.currentTime / audio.duration) * 100;
    if(!progressPorcentage){
        currentProgressionBar.setAttribute('style',`width: 0%`)
        return; //El return es importante para que no se ejecute el siguiente código de la función
    }

    currentProgressionBar.setAttribute('style',`width: ${progressPorcentage}%`)
}

function updateTotalSongTime(){
    let minutes = Math.floor(audio.duration/60);
    let seconds = Math.floor(audio.duration - (minutes * 60));;
    if(seconds < 10){
        seconds = `0${Math.floor(audio.duration - (minutes * 60))}`;
    }

    totalDuration.textContent = `${minutes}:${seconds}`;
}

function updateCurrentTime(){
    // Es interesante ver cómo funciona el operador %
    let minutes = Math.floor(audio.currentTime / 60);
    let seconds = Math.floor(audio.currentTime % 60);
    if((seconds % 60) < 10){
        seconds = `0${Math.floor(audio.currentTime % 60)}`;
    }

    currentTime.textContent = `${minutes}:${seconds}`;
    updateProgressionBar();
}

// Set progress Bar when clicking
/*ClientWidth property: returns the viewable width of an element in pixels, including padding, but not the border, scrollbar or margin. Esta
es una propiedad del elemento DOM, es por eso que se llama como si fuera propiedad de this.
OffsetX property: provides the offset in the X coordinate of the mouse pointer between that event and the padding edge of the target node.
Esta es una propiedad de el evento click y nos da como valor píxeles dependiendo del tamaño de nuestro elemento en el DOM. 

En la siguiente función se sacó el largo del contenedor en píxeles, además del valor en píxeles que nos da el evento al darle click a el
elemento. Luego si dividimos los píxeles del todo el contenedor entre los píxeles que obtenemos del largo del contenedor al darle click nos
da como resultado un porcentaje. Si ese porcentaje lo multiplicamos por los segundos que lleva la canción obtenemos el porcentaje de cada
segundo recorrido en el ancho de la barra de progresión. Algo así */
function setProgressBarWhenClicking(event){
    const progressBarWidth = this.clientWidth;
    const mouseClickX = event.offsetX;

    audio.currentTime = (mouseClickX/progressBarWidth) * audio.duration;
    console.log(progressBarWidth, mouseClickX);
    console.log((mouseClickX/progressBarWidth) * audio.duration) //Nos da el resultado en segundos
}


// EVENTS -------------------------------------------------------------------------------------------------------------------------------------

// Set progress bar event
totalProgressBar.addEventListener('click', setProgressBarWhenClicking);

// Play / Pause event
togglePlayPauseButton.addEventListener('click', playPauseButton);

// Load web page events
window.addEventListener('load', renderSongs);
window.addEventListener('load',updateProgressionBar);
window.addEventListener('load',()=>{
    setTimeout(updateTotalSongTime,0250);
})

// Next song event
nextSong.addEventListener('click', changeNextSong);
previousSong.addEventListener('click', changePreviousSong);
console.log(audio);

// TimeUpdate event. Ayuda mucho para audios y videos
audio.addEventListener('timeupdate', updateCurrentTime);
audio.addEventListener('ended', changeNextSong);