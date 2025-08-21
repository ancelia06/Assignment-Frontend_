(() => {
  const COLS = 4;
  const ROWS = 3;
  const TILES = COLS * ROWS;
  const LIMIT = 5;

  const boardEl = document.getElementById('board');
  const msgEl = document.getElementById('message');
  const restartBtn = document.getElementById('restartBtn');
  const usedEl = document.getElementById('used');
  const leftEl = document.getElementById('left');
  const limitEl = document.getElementById('limit');

  let nemoIndex = -1;
  let used = 0;
  let over = false;

  function randInt(n) {
    return Math.floor(Math.random() * n);
  }

  function tileTemplate(i) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.setAttribute('role', 'button');
    tile.setAttribute('aria-label', `Shell ${i + 1}`);
    tile.tabIndex = 0;
    tile.dataset.index = i;

    const shell = document.createElement('div');
    shell.className = 'shell';
    shell.textContent = '🐚';
    tile.appendChild(shell);
    return tile;
  }

  function drawBoard() {
    boardEl.innerHTML = '';
    for (let i = 0; i < TILES; i++) {
      const tile = tileTemplate(i);
      boardEl.appendChild(tile);
    }
  }

  function setMessage(text, kind) {
    msgEl.className = `message ${kind || ''}`;
    msgEl.innerHTML = text;
  }

  function reveal(tile, isNemo) {
    tile.classList.add('revealed');
    const span = document.createElement('span');
    span.className = 'icon';
    if (isNemo) {
      span.textContent = '🐟';
      span.classList.add('nemo');
      tile.appendChild(span);
      tile.classList.add('highlight');
      tile.setAttribute('aria-label', 'Nemo found!');
    } else {
      span.textContent = '✖';
      span.classList.add('miss');
      tile.appendChild(span);
      tile.setAttribute('aria-label', 'Miss');
    }
  }

  function lockBoard(disabled = true) {
    boardEl.querySelectorAll('.tile').forEach(t => {
      t.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      t.tabIndex = disabled ? -1 : 0;
    });
    over = disabled;
  }

  function updateCounters() {
    usedEl.textContent = used;
    leftEl.textContent = Math.max(0, LIMIT - used);
    limitEl.textContent = LIMIT;
  }

  function onClickTile(e) {
    const tile = e.currentTarget;
    if (over || tile.classList.contains('revealed')) return;

    const idx = Number(tile.dataset.index);
    if (idx === nemoIndex) {
      reveal(tile, true);
      setMessage(`Congratulations, You Won!! <span class="small">Attempts Required to Win: <strong>${used + 1}</strong></span>`, 'win');
      used += 1;
      updateCounters();
      lockBoard(true);
      return;
    }

    reveal(tile, false);
    used += 1;
    updateCounters();

    if (used >= LIMIT) {
      setMessage(`Game Over — You've used all ${LIMIT} chances. `, 'lose');
      const nemoTile = boardEl.querySelector(`.tile[data-index="${nemoIndex}"]`);
      reveal(nemoTile, true);
      lockBoard(true);
    } else {
      setMessage(`Miss! Keep looking… Chances left: ${LIMIT - used}`, '');
    }
  }

  function onKeyTile(e) {
    const tile = e.currentTarget;
    const idx = Number(tile.dataset.index);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      tile.click();
      return;
    }
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx % COLS === COLS - 1) ? idx : idx + 1;
    if (e.key === 'ArrowLeft') next = (idx % COLS === 0) ? idx : idx - 1;
    if (e.key === 'ArrowDown') next = (idx + COLS < TILES) ? idx + COLS : idx;
    if (e.key === 'ArrowUp') next = (idx - COLS >= 0) ? idx - COLS : idx;
    if (next !== idx) {
      e.preventDefault();
      boardEl.querySelector(`.tile[data-index="${next}"]`)?.focus();
    }
  }

  function attachHandlers() {
    boardEl.querySelectorAll('.tile').forEach(t => {
      t.addEventListener('click', onClickTile);
      t.addEventListener('keydown', onKeyTile);
    });
  }

  function newGame() {
    used = 0;
    over = false;
    nemoIndex = randInt(TILES);
    drawBoard();
    attachHandlers();
    updateCounters();
    lockBoard(false);
    setMessage('Find Nemo hidden under a shell. You have only 5 chances! <span class="small"></span>');
  }

  restartBtn.addEventListener('click', newGame);
  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'r') newGame();
  });

  newGame();
})();
