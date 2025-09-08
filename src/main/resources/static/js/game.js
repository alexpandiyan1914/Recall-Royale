// game.js
// main game UI: polls /api/game/state and performs flips

const API = '/api/game';
const cfg = JSON.parse(localStorage.getItem('recall_cfg') || '{}');
if (!cfg || !cfg.players) {
  location.href = 'index.html';
}

const imageMap = {
  "img_01": "images/adharva.jpg",
  "img_02": "images/ajith.jpg",
  "img_03": "images/arvind.jpg",
  "img_04": "images/danush.jpg",
  "img_05": "images/dq.jpg",
  "img_06": "images/jayamravi.jpg",
  "img_07": "images/jiiva.jpg",
  "img_08": "images/kamal.jpeg",
  "img_09": "images/karthi.jpg",
  "img_10": "images/madhav.jpg",
  "img_11": "images/prbhu.jpg",
  "img_12": "images/rajini.jpeg",
  "img_13": "images/simbu.jpg",
  "img_14": "images/sk.jpg",
  "img_15": "images/surya.jpg",
  "img_16": "images/vijay.jpg",
  "img_17": "images/vikram.jpg",
  "img_18": "images/vjs.jpeg"
};

// preload images (if images mode)
if (cfg.mode === 'IMAGES') {
  Object.values(imageMap).forEach(src => { const im = new Image(); im.src = src; });
}

const playersStrip = document.getElementById('playersStrip');
const boardEl = document.getElementById('board');
const turnTxt = document.getElementById('turnTxt');
const winnerMsg = document.getElementById('winnerMsg');

let latestState = null;
let pollInterval = null;

// build placeholders for players strip based on backend players but we show based on state
function renderPlayers(state) {
  playersStrip.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const pill = document.createElement('div');
    pill.className = 'player-pill';
    if (state.players[i]) {
      pill.innerHTML = `<div class="name">${state.players[i].name}</div><div class="score">${state.players[i].score}</div>`;
    } else {
      pill.innerHTML = `<div class="name">P${i+1}</div><div class="score">-</div>`;
    }
    if (i === state.currentPlayerIdx && state.status === 'RUNNING') pill.classList.add('active');
    playersStrip.appendChild(pill);
  }
}

// render board grid columns
function setGrid(cols) {
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 72px)`;
}

// render entire board from state
function renderBoard(state) {
  latestState = state;
  winnerMsg.textContent = '';

  // update turn text
  if (state.status === 'RUNNING') {
    const p = state.players[state.currentPlayerIdx];
    turnTxt.textContent = `Turn: ${p ? p.name : '—'}`;
  } else if (state.status === 'FINISHED') {
    turnTxt.textContent = 'Game Over';
    // compute winner on frontend (backend already sets FINISHED)
    const best = [...state.players].filter(Boolean).sort((a,b)=>b.score-a.score)[0];
    if (best) {
      localStorage.setItem('recall_winner', best.name);
    }
    // small delay then redirect to winner page
    setTimeout(()=> location.href = 'winner.html', 800);
    playSound('winSound');
    return;
  } else {
    turnTxt.textContent = 'Lobby';
  }

  renderPlayers(state);

  setGrid(state.cols);
  boardEl.innerHTML = '';

  state.tiles.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'tile';
    if (t.blocked) btn.classList.add('blocked');
    if (t.faceUp) btn.classList.add('faceup');
    if (t.matched) btn.classList.add('matched');

    if (t.faceUp || t.matched) {
      if (t.blocked) {
        btn.textContent = '■';
      } else if (state.mode === 'IMAGES' || cfg.mode === 'IMAGES') {
        // show image if available
        const imgKey = t.key;
        if (imageMap[imgKey]) {
          const img = document.createElement('img');
          img.src = imageMap[imgKey];
          img.alt = imgKey;
          img.style.width = '64px';
          img.style.height = '64px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '6px';
          btn.appendChild(img);
        } else {
          btn.textContent = t.key;
        }
      } else {
        btn.textContent = t.key;
      }
    } else {
      btn.textContent = '';
    }

    btn.onclick = () => onTileClick(t.index);
    boardEl.appendChild(btn);
  });
}

function playSound(id) {
  const audio = document.getElementById(id);
  if (!audio) return;
  try { audio.currentTime = 0; audio.play(); } catch(e) {}
}

let busy = false;
async function onTileClick(idx) {
  if (busy) return;
  if (!latestState || latestState.status !== 'RUNNING') return;

  // ignore flipping matched or blocked tiles client-side (backend also checks)
  const tile = latestState.tiles[idx];
  if (!tile) return;
  if (tile.matched || tile.blocked) return;

  busy = true;
  playSound('clickSound');

  try {
    const res = await fetch(API + '/flip', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ index: idx })
    });
    const data = await res.json();
    // refresh state from server to show the flip(s)
    await refreshState();

    if (data.action === 'MATCH') {
      playSound('matchSound');
      busy = false;
      return;
    }
    if (data.action === 'MISMATCH') {
      playSound('mismatchSound');
      // leave tiles shown a bit then call hidePending
      await new Promise(r => setTimeout(r, 800));
      await fetch(API + '/hidePending', { method: 'POST' });
      await refreshState();
    }
  } catch (err) {
    console.error('flip error', err);
  }
  busy = false;
}

async function refreshState() {
  try {
    const res = await fetch(API + '/state');
    const state = await res.json();
    renderBoard(state);
  } catch (err) {
    console.error('state error', err);
  }
}

// start polling
refreshState();
pollInterval = setInterval(() => { refreshState(); }, 1200);
