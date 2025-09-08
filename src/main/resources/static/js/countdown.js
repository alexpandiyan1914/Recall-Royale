// countdown.js
// reads config from localStorage, shows 3s countdown, calls /start, then goes to game.html

const cfg = JSON.parse(localStorage.getItem('recall_cfg') || '{}');
if (!cfg || !cfg.players) {
  // if user opened directly, redirect to setup
  location.href = 'index.html';
}

const API = '/api/game';
const countEl = document.getElementById('countText');
let n = 3;
countEl.textContent = n;

const timer = setInterval(async () => {
  n--;
  if (n <= 0) {
    clearInterval(timer);
    // start game on backend
    try {
      await fetch(API + '/start', { method: 'POST' });
    } catch (err) {
      console.error('start error', err);
    }
    location.href = 'game.html';
  } else {
    // small pop animation by toggling class
    countEl.textContent = n;
  }
}, 1000);
