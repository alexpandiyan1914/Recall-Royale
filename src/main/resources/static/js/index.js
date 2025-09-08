//const API = '/api/game';
//let rows = 6, cols = 6;
//
//function playSound(id) {
//  const audio = document.getElementById(id);
//  if (audio) {
//    audio.currentTime = 0;
//    audio.play();
//  }
//}
//
//async function createGame() {
//  playSound("clickSound");
//  rows = parseInt(document.getElementById('sizeSel').value, 10);
//  cols = rows;
//  const mode = document.getElementById('modeSel').value;
//
//  await fetch(API + '/create', {
//    method:'POST',
//    headers:{'Content-Type':'application/json'},
//    body: JSON.stringify({ rows, cols, mode })
//  });
//  document.getElementById('startBtn').disabled = false;
//  refresh();
//}
//
//async function joinAll() {
//  playSound("clickSound");
//  const names = ['n1','n2','n3','n4'].map(id => document.getElementById(id).value.trim()).filter(x => x.length>0);
//  for (const nm of names) {
//    await fetch(API + '/join', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:nm}) });
//  }
//  refresh();
//}
//
//async function start() {
//  playSound("clickSound");
//  await fetch(API + '/start', { method:'POST' });
//  refresh();
//}
//
//function gridCss(n){ return `repeat(${n}, 72px)`; }
//
//async function refresh() {
//  const res = await fetch(API + '/state');
//  const state = await res.json();
//
//  // corners
//  for (let i=0; i<4; i++) {
//    const el = document.getElementById('p'+i);
//    if (state.players[i]) el.textContent = `${state.players[i].name}: ${state.players[i].score}`;
//    else el.textContent = `P${i+1}: -`;
//  }
//
//  const turn = document.getElementById('turnTxt');
//  const winner = document.getElementById('winner');
//  winner.textContent = '';
//  if (state.status === 'RUNNING') {
//    const p = state.players[state.currentPlayerIdx];
//    turn.textContent = `Turn: ${p ? p.name : '—'}`;
//  } else if (state.status === 'FINISHED') {
//    const best = [...state.players].sort((a,b)=>b.score-a.score)[0];
//    turn.textContent = 'Game Over';
//    winner.textContent = `🏆 Winner: ${best.name} with ${best.score} point(s)!`;
//    playSound("winSound");
//  } else {
//    turn.textContent = 'Lobby: create game, add players, then Start.';
//  }
//
//  rows = state.rows; cols = state.cols;
//  const board = document.getElementById('board');
//  board.style.gridTemplateColumns = gridCss(cols);
//  board.innerHTML = '';
//  state.tiles.forEach(t => {
//    const btn = document.createElement('button');
//    btn.className = 'cell';
//    if (t.blocked) btn.classList.add('block');
//    if (t.faceUp) btn.classList.add('faceup');
//    if (t.matched) btn.classList.add('matched');
//
//    btn.textContent = (t.faceUp || t.matched) ? (t.blocked ? '■' : t.key) : '';
//    btn.onclick = ()=> flip(t.index);
//    board.appendChild(btn);
//  });
//}
//
//async function flip(idx) {
//  playSound("clickSound");
//  const res = await fetch(API + '/flip', {
//    method:'POST',
//    headers:{'Content-Type':'application/json'},
//    body: JSON.stringify({ index: idx })
//  });
//  const data = await res.json();
//  await refresh();
//
//  if (data.action === 'MATCH') {
//    playSound("matchSound");
//  }
//  if (data.action === 'MISMATCH') {
//    playSound("mismatchSound");
//    await new Promise(r => setTimeout(r, 800));
//    await fetch(API + '/hidePending', { method:'POST' });
//    await refresh();
//  }
//}
//
//refresh();

const API = '/api/game';
let rows = 6, cols = 6;

function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

async function createGame() {
  playSound("clickSound");
  rows = parseInt(document.getElementById('sizeSel').value, 10);
  cols = rows;
  const mode = document.getElementById('modeSel').value;

  await fetch(API + '/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows, cols, mode })
  });
  document.getElementById('startBtn').disabled = false;
  refresh();
}

async function joinAll() {
  playSound("clickSound");
  const names = ['n1','n2','n3','n4']
    .map(id => document.getElementById(id).value.trim())
    .filter(x => x.length > 0);

  for (const nm of names) {
    await fetch(API + '/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nm })
    });
  }
  refresh();
}

async function start() {
  playSound("clickSound");
  await fetch(API + '/start', { method: 'POST' });
  refresh();
}

function gridCss(n) { return `repeat(${n}, 72px)`; }

// Backend key → Image filename
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

async function refresh() {
  const res = await fetch(API + '/state');
  const state = await res.json();

  // update scores
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById('p' + i);
    if (state.players[i]) {
      el.textContent = `${state.players[i].name}: ${state.players[i].score}`;
    } else {
      el.textContent = `P${i + 1}: -`;
    }
  }

  const turn = document.getElementById('turnTxt');
  const winner = document.getElementById('winner');
  winner.textContent = '';

  if (state.status === 'RUNNING') {
    const p = state.players[state.currentPlayerIdx];
    turn.textContent = `Turn: ${p ? p.name : '—'}`;
  } else if (state.status === 'FINISHED') {
    const best = [...state.players].sort((a, b) => b.score - a.score)[0];
    turn.textContent = 'Game Over';
    winner.textContent = `🏆 Winner: ${best.name} with ${best.score} point(s)!`;
    playSound("winSound");
  } else {
    turn.textContent = 'Lobby: create game, add players, then Start.';
  }

  rows = state.rows; cols = state.cols;
  const board = document.getElementById('board');
  board.style.gridTemplateColumns = gridCss(cols);
  board.innerHTML = '';

  state.tiles.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'cell';
    if (t.blocked) btn.classList.add('block');
    if (t.faceUp) btn.classList.add('faceup');
    if (t.matched) btn.classList.add('matched');

    if (t.faceUp || t.matched) {
      if (t.blocked) {
        btn.textContent = '■';
      } else if (imageMap[t.key]) {
        const img = document.createElement('img');
        img.src = imageMap[t.key];
        img.alt = t.key;
        img.style.width = "60px";
        img.style.height = "60px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "6px";
        btn.appendChild(img);
      } else {
        btn.textContent = t.key; // fallback
      }
    } else {
      btn.textContent = '';
    }

    btn.onclick = () => flip(t.index);
    board.appendChild(btn);
  });
}

async function flip(idx) {
  playSound("clickSound");
  const res = await fetch(API + '/flip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index: idx })
  });
  const data = await res.json();
  await refresh();

  if (data.action === 'MATCH') {
    playSound("matchSound");
  }
  if (data.action === 'MISMATCH') {
    playSound("mismatchSound");
    await new Promise(r => setTimeout(r, 800));
    await fetch(API + '/hidePending', { method: 'POST' });
    await refresh();
  }
}

refresh();
