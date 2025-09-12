const cfg = JSON.parse(localStorage.getItem('recall_cfg') || '{}');
if (!cfg || !cfg.players) {
  location.href = 'index.html';
}

const API = '/api/game';
const countEl = document.getElementById('countText');
let n = 3;
countEl.textContent = n;

function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.pause(); // stop any ongoing playback
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

function updateCountdown() {
  if (n > 0) {
    playSound("tickSound");
    countEl.textContent = n;
    n--;
    setTimeout(updateCountdown, 1000);
  } else {
    playSound("goSound");
    countEl.textContent = "GO!";
    fetch(API + '/start', { method: 'POST' }).catch(err => {
      console.error('start error', err);
    });
    setTimeout(() => {
      location.href = 'game.html';
    }, 800); // allow sound to finish
  }
}

setTimeout(updateCountdown, 1000); // initial delay before countdown starts