// winner.js
const winner = localStorage.getItem('recall_winner') || 'No one';
document.getElementById('winnerName').textContent = winner;

// small confetti effect using CSS particles
const confettiContainer = document.getElementById('confetti');
(function spawnConfetti(){
  for(let i=0;i<40;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.position = 'absolute';
    el.style.left = Math.random()*100 + '%';
    el.style.top = Math.random()*50 + '%';
    el.style.fontSize = (8+Math.random()*18) + 'px';
    el.style.opacity = Math.random();
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.textContent = ['🎉','✨','💥','🏆'][Math.floor(Math.random()*4)];
    confettiContainer.appendChild(el);
    // animate using CSS transitions
    el.animate([{ transform:'translateY(0) rotate(0)' }, { transform:'translateY(500px) rotate(360deg)' }], { duration: 2000 + Math.random()*2000 });
    setTimeout(()=> el.remove(), 3500);
  }
})();

// CSS for confetti pieces injection (so we can keep single file)
const style = document.createElement('style');
style.innerHTML = `
  .confetti-piece { pointer-events:none; user-select:none; }
`;
document.head.appendChild(style);
