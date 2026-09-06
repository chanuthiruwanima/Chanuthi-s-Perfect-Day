let current_song = 0;
let audio = null;
let playing = false;
let play_pause_btn = document.getElementById("play");

let songs = [
  {
     song_name: "Music on the Radio",
     artist: "Empire of the Sun",
     url: "Music on the Radio.mp3",
  },
  {
     song_name: "Show Me Love",
     artist: "WizTheMc & bees & honey",
     url: "Show Me Love.mp3",
  },
  {
     song_name: "Mona Lisa",
     artist: "Dominic Fike",
     url: "Mona Lisa.mp3",
  },
  {
     song_name: "no more regrets",
     artist: "almost monday",
     url: "no more regrets.mp3",
  },
  {
     song_name: "Unforgettable",
     artist: "French Montana ft Swae Lee",
     url: "Unforgettable.mp3",
  },  
];

function setSong(index) {
  if (audio) {
     audio.pause();
  }

  audio = new Audio(songs[index].url);

  audio.addEventListener("loadeddata", () => {
     audio.controls = true;
     document.getElementById("song-name").innerHTML = songs[index].song_name;
     document.getElementById("artist-name").innerHTML = songs[index].artist;
  });

  audio.addEventListener("ended", () => {
     nextSong();
  });
}

function nextSong() {
  current_song = (current_song + 1) % songs.length;
  setSong(current_song);

  if (playing) {
     audio.play();
  }
}

function prevSong() {
  current_song = (current_song - 1 + songs.length) % songs.length;
  setSong(current_song);

  if (playing) {
     audio.play();
  }
} 

play_pause_btn.addEventListener("click", () => {
  if (!playing) {
     audio.play();
     play_pause_btn.innerHTML = '<i class="fas fa-solid fa-pause"></i>';
     playing = true;
  } else {
     audio.pause();
     play_pause_btn.innerHTML = '<i class="fas fa-solid fa-play"></i>';
     playing = false;
  }
});

setSong(current_song);
document.addEventListener("DOMContentLoaded", function () {
  const timerDisplay = document.getElementById("timer-display");
  const presetButtons = document.querySelectorAll(".timer-btn");
  const pauseButton = document.getElementById("pause-button");
  
  let countdownInterval;
  let remainingSeconds = 0;
  let isPaused = false;

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  function runTimer() {
    countdownInterval = setInterval(() => {
      if (!isPaused) {
        remainingSeconds--;

        if (remainingSeconds >= 0) {
          timerDisplay.textContent = formatTime(remainingSeconds);
        } else {
          clearInterval(countdownInterval);
          timerDisplay.textContent = "00:00";
          pauseButton.style.display = "none";
          alert("Time's up!");
        }
      }
    }, 1000);
  }

  function startTimer(minutes) {
    clearInterval(countdownInterval);
    
    remainingSeconds = minutes * 60;
    isPaused = false;
    pauseButton.innerHTML = '<i class="fas fa-solid fa-pause"></i>';;
    pauseButton.style.display = "inline-block";
    
    timerDisplay.textContent = formatTime(remainingSeconds);
    runTimer();
  }

  pauseButton.addEventListener("click", () => {
    if (remainingSeconds <= 0) return;

    if (isPaused) {
      isPaused = false;
      pauseButton.innerHTML = '<i class="fas fa-solid fa-pause"></i>';
    } else {
      isPaused = true;
      pauseButton.innerHTML = '<i class="fas fa-solid fa-play"></i>';
    }
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const minutes = parseInt(button.getAttribute("data-minutes"));
      startTimer(minutes);
    });
  });
});

function generateRandomPlan() {
  const cards = document.querySelectorAll("#dopamine-menu .card");
  const planList = document.getElementById("plan-results-list");
  
  planList.innerHTML = ""; 

  cards.forEach((card) => {
    const categoryTitle = card.querySelector("h4").textContent.trim();
    const items = Array.from(card.querySelectorAll("li")).map((li) => li.textContent.trim());
    
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      
      const li = document.createElement("li");
      li.innerHTML = `<strong>${categoryTitle}</strong> ${randomItem}`;
      planList.appendChild(li);
    }
  });

  document.getElementById("plan").classList.remove("hidden");
}

function closePlanModal() {
  document.getElementById("plan").classList.add("hidden");
}
