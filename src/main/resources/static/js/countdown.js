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
    audio.currentTime = 0;
    audio.play().catch(() => {}); // avoid autoplay errors
  }
}

const timer = setInterval(async () => {
  n--;

  if (n <= 0) {
    clearInterval(timer);
    playSound("goSound"); // ✅ final "GO!" sound
    try {
      await fetch(API + '/start', { method: 'POST' });
    } catch (err) {
      console.error('start error', err);
    }
    setTimeout(() => { location.href = 'game.html'; }, 800); // delay so sound plays
  } else {
    countEl.textContent = n;
    playSound("tickSound"); // ✅ tick sound each second
  }
}, 1000);
