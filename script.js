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

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playShutterSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
  
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function playTimerEndSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  [523.25, 659.25, 783.99].forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + (idx * 0.12));
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (idx * 0.12) + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + (idx * 0.12));
    osc.stop(audioCtx.currentTime + (idx * 0.12) + 0.3);
  });
}

function showCustomAlert(title, message, emoji = '✨') {
  document.getElementById('custom-modal-title').innerText = title;
  document.getElementById('custom-modal-message').innerText = message;
  document.querySelector('.modal-emoji').innerText = emoji;
  
  document.getElementById('custom-alert-modal').classList.remove('hidden');
}

function closeCustomAlert() {
  document.getElementById('custom-alert-modal').classList.add('hidden');
}

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

if (play_pause_btn) {
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
}

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
          playTimerEndSound();
          showCustomAlert("Time's Up!", "Your timer has reached 00:00.", "⏰");
        }
      }
    }, 1000);
  }

  function startTimer(minutes) {
    clearInterval(countdownInterval);
    
    remainingSeconds = minutes * 60;
    isPaused = false;
    pauseButton.innerHTML = '<i class="fas fa-solid fa-pause"></i>';
    pauseButton.style.display = "inline-block";
    
    timerDisplay.textContent = formatTime(remainingSeconds);
    runTimer();
  }

  if (pauseButton) {
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
  }

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

const video = document.getElementById('webcam');
let capturedPhotos = [];
let cameraAvailable = false;

async function initCamera() {
  try {
    if (navigator.mediaDevices && video) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      video.srcObject = stream;
      video.play();
      cameraAvailable = true;
    }
  } catch (err) {
    console.warn("Camera access denied or unavailable:", err);
    cameraAvailable = false;
    showCustomAlert("Camera Disabled", "Camera permission missing! You can still use the Upload Photo button.", "📷");
  }
}
initCamera();

async function takeSinglePhoto() {
  if (!cameraAvailable) {
    showCustomAlert("Camera Required", "Please enable camera access or upload an image manually.", "⚠️");
    return;
  }
  if (capturedPhotos.length >= 3) return;

  const countdownEl = document.getElementById('countdown');
  countdownEl.classList.remove('hidden');

  for (let count = 3; count > 0; count--) {
    countdownEl.innerText = count;
    await new Promise(r => setTimeout(r, 600));
  }
  countdownEl.innerText = "📸";

  playShutterSound();

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = video.videoWidth || 300;
  tempCanvas.height = video.videoHeight || 225;
  const ctx = tempCanvas.getContext('2d');
  ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
  
  addPhotoToStrip(tempCanvas.toDataURL('image/png'));

  setTimeout(() => {
    countdownEl.classList.add('hidden');
  }, 300);
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
  
  document.getElementById('postcard-strip-preview').classList.remove('hidden');
  document.getElementById('entry-fields').classList.remove('hidden');

  document.getElementById('retake-btn').classList.remove('hidden');
  document.getElementById('save-entry-btn').classList.remove('hidden');
  document.getElementById('download-btn').classList.remove('hidden');
  document.getElementById('custom-tools').classList.remove('hidden');
}

function resetBooth() {
  capturedPhotos = [];
  document.getElementById('sticker-layer').innerHTML = '';
  document.getElementById('slot-indicator').innerText = 'Photo 1 of 3';
  
  document.getElementById('camera-view').classList.remove('hidden');
  document.getElementById('upload-label').classList.remove('hidden');
  
  document.getElementById('postcard-strip-preview').classList.add('hidden');
  document.getElementById('entry-fields').classList.add('hidden');

  document.getElementById('retake-btn').classList.add('hidden');
  document.getElementById('save-entry-btn').classList.add('hidden');
  document.getElementById('download-btn').classList.add('hidden');
  document.getElementById('custom-tools').classList.add('hidden');
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

let journalEntries = JSON.parse(localStorage.getItem('perfectDayEntries')) || [];

function toggleJournalDrawer() {
  const drawer = document.getElementById('journal-drawer');
  drawer.classList.toggle('hidden');
  if (!drawer.classList.contains('hidden')) {
    renderJournalHistory();
  }
}

function startNewJournalEntry() {
  document.getElementById('entry-title').value = '';
  document.getElementById('entry-note').value = '';

  resetBooth();
  document.querySelector('.photobooth-container').scrollIntoView({ behavior: 'smooth' });
}

function saveFullScrapbookEntry(photoStripDataUrl) {
  const title = document.getElementById('entry-title').value || 'My Perfect Day';
  const note = document.getElementById('entry-note').value || '';
  
  const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    title: title,
    note: note,
    stripImage: photoStripDataUrl
  };

  journalEntries.unshift(newEntry);
  localStorage.setItem('perfectDayEntries', JSON.stringify(journalEntries));
  
  showCustomAlert('Memory Saved!', 'Entry added to your Journal Drawer!', '💖');
  renderJournalHistory();
}

function renderJournalHistory() {
  const historyContainer = document.getElementById('journal-history-list');
  historyContainer.innerHTML = '';

  if (journalEntries.length === 0) {
    historyContainer.innerHTML = '<p class="empty-msg">No journal entries yet. Tap "New Entry" to create one!</p>';
    return;
  }

  journalEntries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="history-card-header">
        <span class="history-date">${entry.date}</span>
        <h4>${escapeHtml(entry.title)}</h4>
      </div>
      <div class="history-card-body">
        <img src="${entry.stripImage}" alt="Saved Photo Strip" class="history-strip-thumb" />
        <p class="history-note">${escapeHtml(entry.note)}</p>
      </div>
      <button class="delete-entry-btn" onclick="deleteJournalEntry(${entry.id})">🗑️ Delete</button>
    `;
    historyContainer.appendChild(card);
  });
}

function deleteJournalEntry(id) {
  journalEntries = journalEntries.filter(entry => entry.id !== id);
  localStorage.setItem('perfectDayEntries', JSON.stringify(journalEntries));
  renderJournalHistory();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

function saveCurrentEntryWithoutDownload() {
  const stripElement = document.getElementById('strip-workspace');
  
  html2canvas(stripElement, { scale: 2 }).then(canvas => {
    const stripDataUrl = canvas.toDataURL('image/png');
    saveFullScrapbookEntry(stripDataUrl);
  });
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
        });

        const captionInput = document.getElementById('strip-caption');
        if (captionInput && captionInput.value) {
          ctx.font = `${20 * (stripWidth / 160)}px 'Caveat', cursive`;
          ctx.fillStyle = '#444444';
          ctx.textAlign = 'center';
          ctx.fillText(captionInput.value, stripWidth / 2, stripHeight - 20);
        }

        const stripDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'memory-strip.png';
        link.href = stripDataUrl;
        link.click();

        saveFullScrapbookEntry(stripDataUrl);
      }
    };
  });
}