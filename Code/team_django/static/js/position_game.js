const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

let levelDataAll = [];
let targets = [];
let foundTargets = [];
let currentLevel = 1;

fetch('/static/data/position_game_levels.json')
  .then(res => res.json())
  .then(data => {
    levelDataAll = data;
    loadLevel(currentLevel);  // 레벨 1부터 시작
  });

function loadLevel(level) {
  const levelData = levelDataAll.find(l => l.level === level);
  if (!levelData) {
    document.getElementById('clearMessage').textContent = '🎉 모든 레벨을 클리어했습니다!';
    document.getElementById('nextLevelBtn').style.display = 'none';
    return;
  }

  currentLevel = level;
  image.src = `/static/${levelData.background}`;
  targets = levelData.targets;
  foundTargets = Array(targets.length).fill(false);

  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    renderWordList();
    document.getElementById('clearMessage').textContent = '';
    document.getElementById('nextLevelBtn').style.display = 'inline-block';
  };
}

canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = parseFloat(e.clientX - rect.left).toFixed(2);
  const y = parseFloat(e.clientY - rect.top).toFixed(2);
  console.log(`클릭 시 좌표: (${x}, ${y})`);

  for (let i = 0; i < targets.length; i++) {
    if (!foundTargets[i]) {
      const target = targets[i];
      let isCorrect = false;

      if ('xRange' in target && 'yRange' in target) {
        isCorrect =
          x >= target.xRange.min && x <= target.xRange.max &&
          y >= target.yRange.min && y <= target.yRange.max;
      } else {
        const dx = x - target.x;
        const dy = y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        isCorrect = distance < target.radius;
      }

      if (isCorrect) {
        foundTargets[i] = true;
        renderWordList();

        if ('xRange' in target && 'yRange' in target) {
          const cx = (target.xRange.min + target.xRange.max) / 2;
          const cy = (target.yRange.min + target.yRange.max) / 2;
          renderCircle({ x: cx, y: cy, radius: target.radius || 30 });
        } else {
          renderCircle(target);
        }

        checkAllFound();
        break;
      }
    }
  }
});

function renderWordList() {
  const listDiv = document.getElementById('targetList');
  listDiv.innerHTML = '';
  targets.forEach((t, i) => {
    const span = document.createElement('span');
    span.className = 'found-item' + (foundTargets[i] ? ' found' : '');
    span.textContent = t.name;
    listDiv.appendChild(span);
  });
}

function renderCircle(target) {
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function checkAllFound() {
  if (foundTargets.every(f => f)) {
    document.getElementById('clearMessage').textContent = '🎉 모두 찾았어요!';
    document.getElementById('nextLevelBtn').style.display = 'inline-block';  // 중요!
  }
}

function goToNextLevel() {
  loadLevel(currentLevel + 1);
}