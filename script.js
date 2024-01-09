console.log('Lets write JavaScript');
let currentSong = new Audio;
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder){
currFolder = folder;
let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a")
 songs = []
for (let index =0; index < as.length; index++){
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
}
       

      //show all the song in the playlist
   let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
   songUL.innerHTML = ""
   for (const song of songs) {
       songUL.innerHTML = songUL.innerHTML + `<li><img class="invert"  src="img/music.svg" alt="">
                           <div class="info">
                               <div> ${song.replaceAll("%20", " ")}</div>
                               <div>Sonal</div>
                           </div>
                           <div class="playnow">
                               <span>Play Now</span>
                               <img class="invert" src="img/play.svg" height="20" width="20" alt="">
                           </div> </li>`;
   }
    //attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
    })

    return songs
}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "img/pause.svg"
    }
    
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

 
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
     let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index]; 
    
     if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0]

           //get the metadata of the folder
           let a = await fetch(`/songs/${folder}/info.json`)
           let response = await a.json();
           console.log(response)
           cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
           <div class="play">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="88" height="88">
                <circle cx="24" cy="24" r="22" fill="#1DB954" stroke="#191414" stroke-width="2"/>
                <polygon points="18 14 34 24 18 34" fill="#191414"/>
              </svg>


           </div> 
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          
        </div>`
        }
   }

    //load the playlist whenever card is clicked

Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
        playMusic(songs[0])

    })
})

}



async function main(){

   

    //get the list of all the songs
     songs = await getSongs("songs/calming")
    playMusic(songs[0], true)
  
         
 //display all the album on the page  
 await displayAlbums()


    //attach an event listener to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
             play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
             play.src = "img/play.svg"
        }
    })
  
 //listen for timeupdate event
 currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} 
    / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
 })


 //add an event listener tp seekbar
 document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
 })

 // Add an event listener for hamburger
 document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
 })

 // Add an event listener for closebutton
 document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
 })


//Add an event listener to  previous 
previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
 })
 //Add an event listener to next
 next.addEventListener("click", () => {
    currentSong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})


  // Add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100")
    currentSong.volume = parseInt(e.target.value) / 100
    if (currentSong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
})

document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})


}
main()
