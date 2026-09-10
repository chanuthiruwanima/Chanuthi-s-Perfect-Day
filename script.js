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
}const video = document.getElementById('webcam');
let capturedPhotos = [];

async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
  } catch (err) {
    console.warn("Camera access denied or unavailable:", err);
  }
}
initCamera();

async function takeSinglePhoto() {
  if (capturedPhotos.length >= 3) return;

  const countdownEl = document.getElementById('countdown');
  countdownEl.classList.remove('hidden');

  for (let count = 3; count > 0; count--) {
    countdownEl.innerText = count;
    await new Promise(r => setTimeout(r, 600));
  }
  countdownEl.innerText = "📸";

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = video.videoWidth || 300;
  tempCanvas.height = video.videoHeight || 225;
  const ctx = tempCanvas.getContext('2d');
  ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
  
  addPhotoToStrip(tempCanvas.toDataURL('image/png'));
  countdownEl.classList.add('hidden');
}

function handleSingleUpload(event) {
  const file = event.target.files[0];
  if (!file || capturedPhotos.length >= 3) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    addPhotoToStrip(e.target.result);
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function addPhotoToStrip(imgData) {
  capturedPhotos.push(imgData);

  const indicator = document.getElementById('slot-indicator');
  
  if (capturedPhotos.length < 3) {
    indicator.innerText = `Photo ${capturedPhotos.length + 1} of 3`;
  } else {
    indicator.innerText = "Memory Made!";
    renderStrip();
  }
}

function renderStrip() {
  document.getElementById('photo-1').src = capturedPhotos[0];
  document.getElementById('photo-2').src = capturedPhotos[1];
  document.getElementById('photo-3').src = capturedPhotos[2];

  document.getElementById('camera-view').classList.add('hidden');
  document.getElementById('upload-label').classList.add('hidden');
  document.getElementById('canvas-view').classList.remove('hidden');
  document.getElementById('retake-btn').classList.remove('hidden');
  document.getElementById('download-btn').classList.remove('hidden');
  document.getElementById('custom-tools').classList.remove('hidden');
}

function spawnSticker(emoji) {
  const stickerLayer = document.getElementById('sticker-layer');
  const sticker = document.createElement('div');
  sticker.className = 'draggable-sticker';
  sticker.innerText = emoji;
  
  sticker.style.left = '60px';
  sticker.style.top = '120px';

  makeElementDraggable(sticker);
  stickerLayer.appendChild(sticker);
}

function makeElementDraggable(elm) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elm.onmousedown = dragMouseDown;
  elm.ontouchstart = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    pos3 = clientX;
    pos4 = clientY;
    
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    pos1 = pos3 - clientX;
    pos2 = pos4 - clientY;
    pos3 = clientX;
    pos4 = clientY;

    elm.style.top = (elm.offsetTop - pos2) + "px";
    elm.style.left = (elm.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}

function resetBooth() {
  capturedPhotos = [];
  document.getElementById('sticker-layer').innerHTML = '';
  document.getElementById('slot-indicator').innerText = 'Photo 1 of 3';
  
  document.getElementById('camera-view').classList.remove('hidden');
  document.getElementById('upload-label').classList.remove('hidden');
  document.getElementById('canvas-view').classList.add('hidden');
  document.getElementById('retake-btn').classList.add('hidden');
  document.getElementById('download-btn').classList.add('hidden');
  document.getElementById('custom-tools').classList.add('hidden');
}

function downloadStrip() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const stripWidth = 320;
  const stripHeight = 720;
  const padding = 16;
  const gap = 12;
  const photoWidth = stripWidth - (padding * 2);
  const photoHeight = 200;

  canvas.width = stripWidth;
  canvas.height = stripHeight;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, stripWidth, stripHeight);

  let loadedImages = 0;

  capturedPhotos.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const yPos = padding + index * (photoHeight + gap);
      
      const imgAspect = img.width / img.height;
      const targetAspect = photoWidth / photoHeight;
      let renderWidth = photoWidth;
      let renderHeight = photoHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > targetAspect) {
        renderWidth = photoHeight * imgAspect;
        offsetX = (photoWidth - renderWidth) / 2;
      } else {
        renderHeight = photoWidth / imgAspect;
        offsetY = (photoHeight - renderHeight) / 2;
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(padding, yPos, photoWidth, photoHeight);
      ctx.clip();
      ctx.drawImage(img, padding + offsetX, yPos + offsetY, renderWidth, renderHeight);
      ctx.restore();

      loadedImages++;
      if (loadedImages === capturedPhotos.length) {
        const stickers = document.querySelectorAll('.draggable-sticker');
        const workspace = document.getElementById('strip-workspace');
        const workspaceRect = workspace.getBoundingClientRect();

        stickers.forEach(sticker => {
          const stickerRect = sticker.getBoundingClientRect();
          const scale = stripWidth / workspaceRect.width;
          const x = (stickerRect.left - workspaceRect.left) * scale;
          const y = (stickerRect.top - workspaceRect.top) * scale;

          ctx.font = `${28 * scale}px sans-serif`;
          ctx.fillText(sticker.innerText, x, y + (24 * scale));

         
        const captionInput = document.getElementById('strip-caption');
        if (captionInput && captionInput.value) {
          ctx.font = `${20 * (stripWidth / 160)}px 'Caveat', cursive`;
          ctx.fillStyle = '#444444';
          ctx.textAlign = 'center';
          ctx.fillText(captionInput.value, stripWidth / 2, stripHeight - 20);
        }
        });

        const link = document.createElement('a');
        link.download = 'memory-strip.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
  });
}