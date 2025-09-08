// setup.js
// Creates game on backend and joins players, then redirects to countdown.html

const API = '/api/game';
const playerCount = document.getElementById('playerCount');
const playerInputs = document.getElementById('playerInputs');
const btnCreateStart = document.getElementById('btnCreateStart');

function renderPlayerInputs() {
  const count = parseInt(playerCount.value, 10);
  playerInputs.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const input = document.createElement('input');
    input.id = `playerName${i}`;
    input.placeholder = `Player ${i} name`;
    input.style.width = '100%';
    playerInputs.appendChild(input);
  }
}
playerCount.addEventListener('change', renderPlayerInputs);
renderPlayerInputs();

btnCreateStart.addEventListener('click', async () => {
  try {
    const size = parseInt(document.getElementById('tileSize').value, 10);
    const modeSel = document.getElementById('gameMode').value;
    // backend expects "LETTERS" or "IMAGES"
    const mode = (modeSel === 'IMAGES' || modeSel === 'Images' || modeSel === 'images') ? 'IMAGES' : 'LETTERS';

    // Create game on backend
    await fetch(API + '/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: size, cols: size, mode })
    });

    // join players
    const count = parseInt(playerCount.value, 10);
    const names = [];
    for (let i = 1; i <= count; i++) {
      const nm = document.getElementById(`playerName${i}`).value.trim() || `Player ${i}`;
      names.push(nm);
      await fetch(API + '/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nm })
      });
    }

    // save client-side config for later pages
    localStorage.setItem('recall_cfg', JSON.stringify({ rows: size, cols: size, mode, players: names }));
    // go to countdown page
    location.href = 'countdown.html';
  } catch (err) {
    console.error('setup error', err);
    alert('Failed to create/join game. Check backend.');
  }
});
