class Board {
  constructor() {
    this.grid = Array(3).fill(null).map(() => Array(3).fill(null));
  }

  placeMark(row, col, mark) {
    if (this.grid[row][col] === null) {
      this.grid[row][col] = mark;
      return true;
    }
    return false;
  }

  isFull() {
    return this.grid.flat().every(cell => cell !== null);
  }

  reset() {
    this.grid = Array(3).fill(null).map(() => Array(3).fill(null));
  }
}

class Player {
  constructor(name, mark) {
    this.name = name;
    this.mark = mark;
  }
}

class GameLogic {
  static checkWinner(grid) {
    const combos = [
      // Rows
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      // Cols
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],
      // Diags
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]]
    ];
    for (let combo of combos) {
      const [a, b, c] = combo;
      if (
        grid[a[0]][a[1]] &&
        grid[a[0]][a[1]] === grid[b[0]][b[1]] &&
        grid[a[0]][a[1]] === grid[c[0]][c[1]]
      ) {
        return grid[a[0]][a[1]];
      }
    }
    return null;
  }
}

//  Facade Class 
class TicTacToeFacade {
  constructor() {
    this.board = new Board();
    this.players = [new Player("Player 1", "X"), new Player("Player 2", "O")];
    this.currentPlayerIndex = 0;
    this.winner = null;
    this.createBoardUI();
  }

  createBoardUI() {
    const boardEl = document.getElementById("board");
    boardEl.innerHTML = "";
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener("click", () => this.playTurn(r, c, cell));
        boardEl.appendChild(cell);
      }
    }
  }

  playTurn(row, col, cellEl) {
    if (this.winner) {
      this.setStatus("Game over! Please reset.");
      return;
    }

    const currentPlayer = this.players[this.currentPlayerIndex];
    if (this.board.placeMark(row, col, currentPlayer.mark)) {
      cellEl.textContent = currentPlayer.mark;
      cellEl.classList.add("taken");

      // Check winner
      this.winner = GameLogic.checkWinner(this.board.grid);
      if (this.winner) {
        this.setStatus(`${currentPlayer.name} wins!`);
        return;
      }

      // Check draw
      if (this.board.isFull()) {
        this.setStatus(" It's a draw!");
        return;
      }

      // Switch turn
      this.currentPlayerIndex = 1 - this.currentPlayerIndex;
      this.setStatus(`Next: ${this.players[this.currentPlayerIndex].name}`);
    }
  }

  resetGame() {
    this.board.reset();
    this.winner = null;
    this.currentPlayerIndex = 0;
    this.createBoardUI();
    this.setStatus(" Game reset. Player 1 starts!");
  }

  setStatus(message) {
    document.getElementById("status").textContent = message;
  }
}

// Start Game 
const game = new TicTacToeFacade();
