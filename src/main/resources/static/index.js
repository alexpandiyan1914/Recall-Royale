const API = '/api/game';
    let rows = 6, cols = 6;

    async function createGame() {
      rows = parseInt(document.getElementById('sizeSel').value, 10);
      cols = rows; // square board
      const mode = document.getElementById('modeSel').value;

      await fetch(API + '/create', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ rows, cols, mode })
      });
      document.getElementById('startBtn').disabled = false;
      refresh();
    }

    async function joinAll() {
      const names = ['n1','n2','n3','n4'].map(id => document.getElementById(id).value.trim()).filter(x => x.length>0);
      for (const nm of names) {
        await fetch(API + '/join', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:nm}) });
      }
      refresh();
    }

    async function start() {
      await fetch(API + '/start', { method:'POST' });
      refresh();
    }

    function gridCss(n){ return `repeat(${n}, 72px)`; }

    async function refresh() {
      const res = await fetch(API + '/state');
      const state = await res.json();

      // corners: up to 4 players
      for (let i=0; i<4; i++) {
        const el = document.getElementById('p'+i);
        if (state.players[i]) el.textContent = `${state.players[i].name}: ${state.players[i].score}`;
        else el.textContent = `P${i+1}: -`;
      }

      // turn text / winner
      const turn = document.getElementById('turnTxt');
      const winner = document.getElementById('winner');
      winner.textContent = '';
      if (state.status === 'RUNNING') {
        const p = state.players[state.currentPlayerIdx];
        turn.textContent = `Turn: ${p ? p.name : '—'}`;
      } else if (state.status === 'FINISHED') {
        const best = [...state.players].sort((a,b)=>b.score-a.score)[0];
        turn.textContent = 'Game Over';
        winner.textContent = `🏆 Winner: ${best.name} with ${best.score} point(s)!`;
      } else {
        turn.textContent = 'Lobby: create game, add players, then Start.';
      }

      // board
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

        btn.textContent = (t.faceUp || t.matched) ? (t.blocked ? '■' : t.key) : '';
        btn.onclick = ()=> flip(t.index);
        board.appendChild(btn);
      });
    }

    async function flip(idx) {
      const res = await fetch(API + '/flip', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ index: idx })
      });
      const data = await res.json();
      await refresh();

      // if mismatch, show the two for 800ms then hide on server
      if (data.action === 'MISMATCH') {
        await new Promise(r => setTimeout(r, 800));
        await fetch(API + '/hidePending', { method:'POST' });
        await refresh();
      }
    }

    // boot
    refresh();