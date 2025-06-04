const memoryTexts = [
  {id:101,text:"초등학교 소풍날"},
  {id:102,text:"첫 발표 연습하던 날"},
  {id:103,text:"비오는 날의 편의점"},
  {id:104,text:"여름방학 여행지"},
  {id:105,text:"기말고사 전날"},
  {id:106,text:"엄마와 장보던 기억"},
  {id:107,text:"친구랑 노래방"},
  {id:108,text:"MT 때 밤샘 이야기"},
  {id:109,text:"기숙사 첫날"},
  {id:110,text:"첫 면접장 앞에서"},
  {id:111,text:"도서관 풍경"},
  {id:112,text:"학교 축제에서 찍은 사진"},
];

function createCard(text, id) {
  const card = document.createElement("div");
  card.className = "memory-card";

  card.innerHTML = `
    <div class="memory-id">#${id}</div>
    <div class="memory-text">${text}</div>
  `;

  return card;
}

function fillRow(rowSelector) {
  const row = document.querySelector(rowSelector);

  // 카드 2배로 넣기 (좌우 반복 흐름을 위해)
  for (let i = 0; i < 2; i++) {
    memoryTexts.forEach(item => {
      row.appendChild(createCard(item.text, item.id));
    });
  }
}

fillRow('.row-1');
fillRow('.row-2');
fillRow('.row-3');
fillRow('.row-4');

function scrollFadeEffect() {
  const rows = document.querySelectorAll('.card-row');

  rows.forEach(row => {
    const cards = row.querySelectorAll('.memory-card');

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const isFullyVisible =
        rect.left >= 0 && rect.right <= window.innerWidth;

      if (isFullyVisible) {
        card.style.opacity = 1;
      } else {
        card.style.opacity = 0.3;
      }
    });
  });

  requestAnimationFrame(scrollFadeEffect);
}

scrollFadeEffect();

// 카드 클릭 시 모달 표시
function setupCardClick(card, title, id) {
  card.addEventListener('click', () => {
    document.getElementById('modalTitle').innerText = `#${id}`;
    document.getElementById('modalBody').innerText = title;
    document.getElementById('cardModal').style.display = 'flex';  // ✅ 'block' → 'flex'
  });
}
function applyWaveEffect(title) {
  if (!title) return;
  const nodes = Array.from(title.childNodes);
  let i = 0;
  title.innerHTML = '';
  nodes.forEach(node => {
    if (node.nodeType === 3) {
      const chars = node.textContent.split('');
      chars.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.classList.add('wave-letter');
        span.style.animationDelay = `${i * 0.08}s`;
        title.appendChild(span);
        i++;
      });
    } else if (node.nodeType === 1 && node.tagName === 'BR') {
      title.appendChild(document.createElement('br'));
    }
  });
}
// 카드 생성 함수에 클릭 이벤트 연결
function createCard(text, id) {
  const card = document.createElement("div");
  card.className = "memory-card";

  card.innerHTML = `
    <div class="memory-id">#${id}</div>
    <div class="memory-text">${text}</div>
  `;

  setupCardClick(card, text, id);  // ✅ 클릭 연결

  return card;
}

// 모달 닫기
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.close-button').onclick = () => {
    document.getElementById('cardModal').style.display = 'none';
  };
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('cardModal').style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.gray-section');
  applyWaveEffect(title);
});