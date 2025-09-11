//// game.js
//// main game UI: polls /api/game/state and performs flips
//
//const API = '/api/game';
//const cfg = JSON.parse(localStorage.getItem('recall_cfg') || '{}');
//if (!cfg || !cfg.players) {
//  location.href = 'index.html';
//}
//
//const imageMap = {
//  "img_01": "images/adharva.jpg",
//  "img_02": "images/ajith.jpg",
//  "img_03": "images/arvind.jpg",
//  "img_04": "images/danush.jpg",
//  "img_05": "images/dq.jpg",
//  "img_06": "images/jayamravi.jpg",
//  "img_07": "images/jiiva.jpg",
//  "img_08": "images/kamal.jpeg",
//  "img_09": "images/karthi.jpg",
//  "img_10": "images/madhav.jpg",
//  "img_11": "images/prbhu.jpg",
//  "img_12": "images/rajini.jpeg",
//  "img_13": "images/simbu.jpg",
//  "img_14": "images/sk.jpg",
//  "img_15": "images/surya.jpg",
//  "img_16": "images/vijay.jpg",
//  "img_17": "images/vikram.jpg",
//  "img_18": "images/vjs.jpeg"
//};
//
//// preload images (if images mode)
//if (cfg.mode === 'IMAGES') {
//  Object.values(imageMap).forEach(src => { const im = new Image(); im.src = src; });
//}
//
//const playersStrip = document.getElementById('playersStrip');
//const boardEl = document.getElementById('board');
//const turnTxt = document.getElementById('turnTxt');
//const winnerMsg = document.getElementById('winnerMsg');
//
//let latestState = null;
//let pollInterval = null;
//
//// build placeholders for players strip based on backend players but we show based on state
//function renderPlayers(state) {
//  playersStrip.innerHTML = '';
//  for (let i = 0; i < 4; i++) {
//    const pill = document.createElement('div');
//    pill.className = 'player-pill';
//    if (state.players[i]) {
//      pill.innerHTML = `<div class="name">${state.players[i].name}</div><div class="score">${state.players[i].score}</div>`;
//    } else {
//      pill.innerHTML = `<div class="name">P${i+1}</div><div class="score">-</div>`;
//    }
//    if (i === state.currentPlayerIdx && state.status === 'RUNNING') pill.classList.add('active');
//    playersStrip.appendChild(pill);
//  }
//}
//
//// render board grid columns
//function setGrid(cols) {
//  boardEl.style.gridTemplateColumns = `repeat(${cols}, 72px)`;
//}
//
//// render entire board from state
//function renderBoard(state) {
//  latestState = state;
//  winnerMsg.textContent = '';
//
//  // update turn text
//  if (state.status === 'RUNNING') {
//    const p = state.players[state.currentPlayerIdx];
//    turnTxt.textContent = `Turn: ${p ? p.name : '—'}`;
//  } else if (state.status === 'FINISHED') {
//    turnTxt.textContent = 'Game Over';
//    // compute winner on frontend (backend already sets FINISHED)
//    const best = [...state.players].filter(Boolean).sort((a,b)=>b.score-a.score)[0];
//    if (best) {
//      localStorage.setItem('recall_winner', best.name);
//    }
//    // small delay then redirect to winner page
//    setTimeout(()=> location.href = 'winner.html', 800);
//    playSound('winSound');
//    return;
//  } else {
//    turnTxt.textContent = 'Lobby';
//  }
//
//  renderPlayers(state);
//
//  setGrid(state.cols);
//  boardEl.innerHTML = '';
//
//  state.tiles.forEach(t => {
//    const btn = document.createElement('button');
//    btn.className = 'tile';
//    if (t.blocked) btn.classList.add('blocked');
//    if (t.faceUp) btn.classList.add('faceup');
//    if (t.matched) btn.classList.add('matched');
//
//    if (t.faceUp || t.matched) {
//      if (t.blocked) {
//        btn.textContent = '■';
//      } else if (state.mode === 'IMAGES' || cfg.mode === 'IMAGES') {
//        // show image if available
//        const imgKey = t.key;
//        if (imageMap[imgKey]) {
//          const img = document.createElement('img');
//          img.src = imageMap[imgKey];
//          img.alt = imgKey;
//          img.style.width = '72px';
//          img.style.height = '72px';
//          img.style.objectFit = 'cover';
//          img.style.borderRadius = '6px';
//          btn.appendChild(img);
//        } else {
//          btn.textContent = t.key;
//        }
//      } else {
//        btn.textContent = t.key;
//      }
//    } else {
//      btn.textContent = '';
//    }
//
//    btn.onclick = () => onTileClick(t.index);
//    boardEl.appendChild(btn);
//  });
//}
//
//function playSound(id) {
//  const audio = document.getElementById(id);
//  if (!audio) return;
//  try { audio.currentTime = 0; audio.play(); } catch(e) {}
//}
//
//let busy = false;
//async function onTileClick(idx) {
//  if (busy) return;
//  if (!latestState || latestState.status !== 'RUNNING') return;
//
//  // ignore flipping matched or blocked tiles client-side (backend also checks)
//  const tile = latestState.tiles[idx];
//  if (!tile) return;
//  if (tile.matched || tile.blocked) return;
//
//  busy = true;
//  playSound('clickSound');
//
//  try {
//    const res = await fetch(API + '/flip', {
//      method: 'POST',
//      headers: {'Content-Type':'application/json'},
//      body: JSON.stringify({ index: idx })
//    });
//    const data = await res.json();
//    // refresh state from server to show the flip(s)
//    await refreshState();
//
//    if (data.action === 'MATCH') {
//      playSound('matchSound');
//      busy = false;
//      return;
//    }
//    if (data.action === 'MISMATCH') {
//      playSound('mismatchSound');
//      // leave tiles shown a bit then call hidePending
//      await new Promise(r => setTimeout(r, 800));
//      await fetch(API + '/hidePending', { method: 'POST' });
//      await refreshState();
//    }
//  } catch (err) {
//    console.error('flip error', err);
//  }
//  busy = false;
//}
//
//async function refreshState() {
//  try {
//    const res = await fetch(API + '/state');
//    const state = await res.json();
//    renderBoard(state);
//  } catch (err) {
//    console.error('state error', err);
//  }
//}
//
//// start polling
//refreshState();
//pollInterval = setInterval(() => { refreshState(); }, 1200);

// game.js
const API = '/api/game';
const cfg = JSON.parse(localStorage.getItem('recall_cfg') || '{}');
if (!cfg || !cfg.players) {
  location.href = 'index.html';
}

// =========================
// IMAGE MAPS BY CATEGORY
// =========================
const imageCategories = {
  ACTORS: {
    "img_01": "images/actors/adharva.jpg",
    "img_02": "images/actors/ajith.jpg",
    "img_03": "images/actors/arvind.jpg",
    "img_04": "images/actors/danush.jpg",
    "img_05": "images/actors/dq.jpg",
    "img_06": "images/actors/jayamravi.jpg",
    "img_07": "images/actors/jiiva.jpg",
    "img_08": "images/actors/kamal.jpeg",
    "img_09": "images/actors/karthi.jpg",
    "img_10": "images/actors/madhav.jpg",
    "img_11": "images/actors/prbhu.jpg",
    "img_12": "images/actors/rajini.jpeg",
    "img_13": "images/actors/simbu.jpg",
    "img_14": "images/actors/sk.jpg",
    "img_15": "images/actors/surya.jpg",
    "img_16": "images/actors/vijay.jpg",
    "img_17": "images/actors/vikram.jpg",
    "img_18": "images/actors/vjs.jpeg"
  },
  LOGOS: {
    "img_01": "images/logos/Accenture.png",
    "img_02": "images/logos/Adobe.jpg",
    "img_03": "images/logos/Amazon.png",
    "img_04": "images/logos/Android.png",
    "img_05": "images/logos/Apple.jpg",
    "img_06": "images/logos/Dell.png",
    "img_07": "images/logos/Discard.png",
    "img_08": "images/logos/Duolingo.png",
    "img_09": "images/logos/Ferrari.jpg",
    "img_10": "images/logos/Flipkart.jpg",
    "img_11": "images/logos/Ford.jpg",
    "img_12": "images/logos/Google.png",
    "img_13": "images/logos/HP.png",
    "img_14": "images/logos/Instagram.jpg",
    "img_15": "images/logos/Jiohotstar.jpg",
    "img_16": "images/logos/KFC.png",
    "img_17": "images/logos/LG.webp",
    "img_18": "images/logos/Linkedin.jpg",
    "img_19": "images/logos/Linux.jpg",
    "img_20": "images/logos/Mcdonalds.png",
    "img_21": "images/logos/Meta.jpg",
    "img_22": "images/logos/Microsoft.jpg",
    "img_23": "images/logos/Netflix.webp",
    "img_24": "images/logos/Nvidia.png",
    "img_25": "images/logos/Open_AI.png",
    "img_26": "images/logos/Pinterest.jpg",
    "img_27": "images/logos/Rolex.png",
    "img_28": "images/logos/Snapchat.jpg",
    "img_29": "images/logos/Sony.png",
    "img_30": "images/logos/Spotify.jpg",
    "img_31": "images/logos/Swiggy.jpg",
    "img_32": "images/logos/Tata.png",
    "img_33": "images/logos/Telegram.webp",
    "img_34": "images/logos/Tesla.jpg",
    "img_35": "images/logos/Vlc.png",
    "img_36": "images/logos/Whatsapp.jpg",
    "img_37": "images/logos/X(Twitter).jpg",
    "img_38": "images/logos/Youtube.webp",
    "img_39": "images/logos/Zomato.png",
    "img_40": "images/logos/Zoom.jpg"
  },
  ONEPIECE: {
    "img_01": "images/OnePiece/ace.jpeg",
    "img_02": "images/OnePiece/akainu.jpeg",
    "img_03": "images/OnePiece/aokiji.jpeg",
    "img_04": "images/OnePiece/bigmom.jpg",
    "img_05": "images/OnePiece/blackbeard.jpeg",
    "img_06": "images/OnePiece/Brook.jpg",
    "img_07": "images/OnePiece/buggy.jpeg",
    "img_08": "images/OnePiece/Chopper.jpg",
    "img_09": "images/OnePiece/crocodile.jpeg",
    "img_10": "images/OnePiece/doflamingo.jpeg",
    "img_11": "images/OnePiece/dragon.jpeg",
    "img_12": "images/OnePiece/franky.jpg",
    "img_13": "images/OnePiece/garp.jpeg",
    "img_14": "images/OnePiece/hancock.jpeg",
    "img_15": "images/OnePiece/Jimbei.jpg",
    "img_16": "images/OnePiece/kaido.jpeg",
    "img_17": "images/OnePiece/katakuri.jpeg",
    "img_18": "images/OnePiece/kid.jpeg",
    "img_19": "images/OnePiece/king.jpeg",
    "img_20": "images/OnePiece/kizaru.jpeg",
    "img_21": "images/OnePiece/kuma.jpeg",
    "img_22": "images/OnePiece/law.jpg",
    "img_23": "images/OnePiece/lucci.jpeg",
    "img_24": "images/OnePiece/luffy.jpeg",
    "img_25": "images/OnePiece/marco.jpeg",
    "img_26": "images/OnePiece/mihawk.jpeg",
    "img_27": "images/OnePiece/Nami.jpg",
    "img_28": "images/OnePiece/oden.jpeg",
    "img_29": "images/OnePiece/Robin.jpg",
    "img_30": "images/OnePiece/roger.jpeg",
    "img_31": "images/OnePiece/sabo.jpeg",
    "img_32": "images/OnePiece/sanji.jpeg",
    "img_33": "images/OnePiece/sengoku.jpeg",
    "img_34": "images/OnePiece/shanks.jpeg",
    "img_35": "images/OnePiece/smoker.jpeg",
    "img_36": "images/OnePiece/sogeking.jpeg",
    "img_37": "images/OnePiece/Usopp.jpg",
    "img_38": "images/OnePiece/whitebeard.jpeg",
    "img_39": "images/OnePiece/yamato.jpg",
    "img_40": "images/OnePiece/Zoro.jpg"
  }
};

// ✅ pick correct map
const imageMap = (cfg.mode === 'IMAGES' && cfg.category && imageCategories[cfg.category])
  ? imageCategories[cfg.category]
  : {};

// preload images if in IMAGES mode
if (cfg.mode === 'IMAGES') {
  Object.values(imageMap).forEach(src => { const im = new Image(); im.src = src; });
}

// =========================
// GAME UI ELEMENTS
// =========================
const playersStrip = document.getElementById('playersStrip');
const boardEl = document.getElementById('board');
const turnTxt = document.getElementById('turnTxt');
const winnerMsg = document.getElementById('winnerMsg');

let latestState = null;
let prevTiles = null;
let pollInterval = null;

// =========================
// PLAYER STRIP
// =========================
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

// =========================
// GRID
// =========================
function setGrid(cols) {
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 72px)`;
}

// =========================
// TILE RENDERING
// =========================
function updateTileButton(btn, tile, mode) {
  btn.className = 'tile';
  if (tile.blocked) btn.classList.add('blocked');
  if (tile.faceUp) btn.classList.add('faceup');
  if (tile.matched) btn.classList.add('matched');

  btn.innerHTML = '';
  if (tile.faceUp || tile.matched) {
    if (tile.blocked) {
      btn.textContent = '■';
    } else if (mode === 'IMAGES' || cfg.mode === 'IMAGES') {
      const imgKey = tile.key;
      if (imageMap[imgKey]) {
        const img = document.createElement('img');
        img.src = imageMap[imgKey];
        img.alt = imgKey;
        img.style.width = '72px';
        img.style.height = '72px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        btn.appendChild(img);
      } else {
        btn.textContent = tile.key;
      }
    } else {
      btn.textContent = tile.key;
    }
  }
}

//// =========================
//// RENDER BOARD
//// =========================
//function renderBoard(state) {
//  latestState = state;
//  winnerMsg.textContent = '';
//
//  if (state.status === 'RUNNING') {
//    const p = state.players[state.currentPlayerIdx];
//    turnTxt.textContent = `Turn: ${p ? p.name : '—'}`;
//  } else if (state.status === 'FINISHED') {
//    turnTxt.textContent = 'Game Over';
//    const best = [...state.players].filter(Boolean).sort((a,b)=>b.score-a.score)[0];
//    if (best) localStorage.setItem('recall_winner', best.name);
//    setTimeout(()=> location.href = 'winner.html', 800);
//    playSound('winSound');
//    return;
//  } else {
//    turnTxt.textContent = 'Lobby';
//  }
//
//  renderPlayers(state);
//  setGrid(state.cols);
//
//  // build buttons once
//  if (boardEl.children.length === 0) {
//    state.tiles.forEach(t => {
//      const btn = document.createElement('button');
//      btn.onclick = () => onTileClick(t.index);
//      boardEl.appendChild(btn);
//    });
//  }
//
//  // update only changed tiles
//  state.tiles.forEach((t, i) => {
//    const prev = prevTiles ? prevTiles[i] : null;
//    if (!prev || JSON.stringify(prev) !== JSON.stringify(t)) {
//      const btn = boardEl.children[i];
//      btn.onclick = () => onTileClick(t.index);
//      updateTileButton(btn, t, state.mode);
//    }
//  });
//
//  prevTiles = JSON.parse(JSON.stringify(state.tiles));
//}
// =========================
// GLOBALS
// =========================
let winnerSaved = false; // 🚀 Prevent duplicate saves

// =========================
// RENDER BOARD
// =========================
function renderBoard(state) {
  latestState = state;
  winnerMsg.textContent = '';

  if (state.status === 'RUNNING') {
    const p = state.players[state.currentPlayerIdx];
    turnTxt.textContent = `Turn: ${p ? p.name : '—'}`;
  } else if (state.status === 'FINISHED') {
    turnTxt.textContent = 'Game Over';
    const best = [...state.players].filter(Boolean).sort((a, b) => b.score - a.score)[0];
    if (best && !winnerSaved) {
      localStorage.setItem('recall_winner', best.name);

      //  Save winner to backend DB (only once)
      saveWinnerToDB(best.name, best.score);
      winnerSaved = true; // ✅ ensure only one save
    }

    setTimeout(() => location.href = 'winner.html', 800);
    playSound('winSound');
    return;
  } else {
    turnTxt.textContent = 'Lobby';
  }

  renderPlayers(state);
  setGrid(state.cols);

  // build buttons once
  if (boardEl.children.length === 0) {
    state.tiles.forEach(t => {
      const btn = document.createElement('button');
      btn.onclick = () => onTileClick(t.index);
      boardEl.appendChild(btn);
    });
  }

  // update only changed tiles
  state.tiles.forEach((t, i) => {
    const prev = prevTiles ? prevTiles[i] : null;
    if (!prev || JSON.stringify(prev) !== JSON.stringify(t)) {
      const btn = boardEl.children[i];
      btn.onclick = () => onTileClick(t.index);
      updateTileButton(btn, t, state.mode);
    }
  });

  prevTiles = JSON.parse(JSON.stringify(state.tiles));
}

// =========================
// SAVE WINNER TO DB
// =========================
function saveWinnerToDB(playerName, score) {
  fetch(`${API}/winner?playerName=${encodeURIComponent(playerName)}&score=${score}`, {
    method: "POST"
  })
    .then(res => res.text())
    .then(msg => {
      console.log(" Winner saved:", msg);
    })
    .catch(err => {
      console.error("Error saving winner:", err);
    });
}


// =========================
// SOUNDS
// =========================
function playSound(id) {
  const audio = document.getElementById(id);
  if (!audio) return;
  try { audio.currentTime = 0; audio.play(); } catch(e) {}
}

// =========================
// TILE CLICK
// =========================
let busy = false;
async function onTileClick(idx) {
  if (busy) return;
  if (!latestState || latestState.status !== 'RUNNING') return;

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
    await refreshState();

    if (data.action === 'MATCH') {
      playSound('matchSound');
      busy = false;
      return;
    }
    if (data.action === 'MISMATCH') {
      playSound('mismatchSound');
      await new Promise(r => setTimeout(r, 800));
      await fetch(API + '/hidePending', { method: 'POST' });
      await refreshState();
    }
  } catch (err) {
    console.error('flip error', err);
  }
  busy = false;
}

// =========================
// REFRESH STATE
// =========================
async function refreshState() {
  try {
    const res = await fetch(API + '/state');
    const state = await res.json();
    renderBoard(state);
  } catch (err) {
    console.error('state error', err);
  }
}

// =========================
// START POLLING
// =========================
refreshState();
pollInterval = setInterval(() => { refreshState(); }, 1200);
