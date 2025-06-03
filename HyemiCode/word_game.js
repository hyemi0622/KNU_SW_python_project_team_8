let currentLevel = 1;
let levels = [];
let board = [], boardSize = 0, words = [], startCell = null;

const boardEl = document.getElementById("board");
const wordListEl = document.getElementById("wordList");
const nextLevelBtn = document.getElementById("next-level-btn");

const directions = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 1 }
];

// JSON 불러오기
fetch("/static/data/word_game_levels.json")
  .then(res => res.json())
  .then(data => { levels = data; });

function startGame(levelNum) {
  currentLevel = levelNum;
  const level = levels.find(l => l.level === levelNum);
  boardSize = level.size;

 
  const shuffled = level.words.sort(() => Math.random() - 0.5);
  const wordCount = Math.min(level.words.length, getRandomInt(3, level.words.length));
  words = shuffled.slice(0, wordCount);

  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));

  document.getElementById("levelSelect").style.display = "none";
  nextLevelBtn.style.display = "none";

  words.forEach(placeWord);
  fillBoardRandom();
  renderBoard();
  renderWordList();
}

function placeWord(word) {
  const maxAttempts = 100;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);

    if (row + dir.dr * (word.length - 1) >= boardSize ||
        col + dir.dc * (word.length - 1) >= boardSize) continue;

    let canPlace = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dir.dr * i;
      const c = col + dir.dc * i;
      if (board[r][c] !== "" && board[r][c] !== word[i]) {
        canPlace = false;
        break;
      }
    }

    if (canPlace) {
      for (let i = 0; i < word.length; i++) {
        const r = row + dir.dr * i;
        const c = col + dir.dc * i;
        board[r][c] = word[i];
      }
      return;
    }
  }
}

function fillBoardRandom() {
  const chars = "가나다라마바사아자차카타파하";
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (!board[r][c]) {
        board[r][c] = chars[Math.floor(Math.random() * chars.length)];
      }
    }
  }
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < boardSize; r++) {
    const row = document.createElement("tr");
    for (let c = 0; c < boardSize; c++) {
      const cell = document.createElement("td");
      cell.textContent = board[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => handleClick(cell));
      row.appendChild(cell);
    }
    boardEl.appendChild(row);
  }
}

function renderWordList() {
  wordListEl.innerHTML = "";
  words.forEach(word => {
    const item = document.createElement("div");
    item.className = "word-item";
    item.id = `word-${word}`;
    item.textContent = word;
    wordListEl.appendChild(item);
  });
}

function handleClick(cell) {
  const r = parseInt(cell.dataset.row);
  const c = parseInt(cell.dataset.col);

  if (!startCell) {
    startCell = { r, c, element: cell };
    cell.classList.add("selected");
  } else {
    const endCell = { r, c };
    const selected = getPath(startCell, endCell);
    const selectedWord = selected.map(cell => board[cell.r][cell.c]).join("");

    if (words.includes(selectedWord)) {
      selected.forEach(cell => {
        const el = boardEl.rows[cell.r].cells[cell.c];
        el.classList.add("found");
        el.classList.remove("selected");
      });
      document.getElementById(`word-${selectedWord}`).classList.add("found-word");
      checkLevelComplete();
    } else {
      startCell.element.classList.remove("selected");
    }
    startCell = null;
  }
}

function getPath(start, end) {
  const path = [];
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  const stepR = dr === 0 ? 0 : dr / len;
  const stepC = dc === 0 ? 0 : dc / len;

  if (!((stepR === 0 && stepC === 1) || (stepR === 1 && stepC === 1))) return [];

  for (let i = 0; i <= len; i++) {
    path.push({ r: start.r + stepR * i, c: start.c + stepC * i });
  }
  return path;
}

function checkLevelComplete() {
  const found = [...document.querySelectorAll('.found-word')].length;
  if (found === words.length) {
    if (currentLevel < 5) {
      nextLevelBtn.style.display = "inline-block";
    } else {
      alert(" 모든 단계를 완료! 집중력 상승 ~");
    }
  }
}

function goToNextLevel() {
  startGame(currentLevel + 1);
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}