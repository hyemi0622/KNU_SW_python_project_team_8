// ========================
// 네컷 만화 슬라이드
// ========================
const comics = [
  ['comic1-1.png', 'comic1-2.png', 'comic1-3.png', 'comic1-4.png'],
  ['comic2-1.png', 'comic2-2.png', 'comic2-3.png', 'comic2-4.png']
];

let currentIndex = 0;
const wrapper = document.getElementById('comicWrapper');
const indexText = document.getElementById('comic-index');
let animating = false;

function createPage(index) {
  const page = document.createElement('div');
  page.className = 'comic-page';
  page.style.position = 'absolute';
  page.style.top = '0';
  page.style.left = '0';
  page.style.width = '100%';
  page.style.height = '100%';
  page.style.display = 'flex';
  page.style.justifyContent = 'center';
  page.style.alignItems = 'center';
  page.style.gap = '2rem';
  page.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
  page.style.zIndex = 1;

  comics[index].forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `네컷 만화 ${index + 1}`;
    img.style.width = '120px';
    img.style.height = '120px';
    img.style.border = '2px solid #000';
    img.style.objectFit = 'contain';
    img.style.flexShrink = '0';
    page.appendChild(img);
  });

  return page;
}

function slideTo(nextIndex, direction = 'left') {
  if (animating) return;
  animating = true;
  const oldPage = wrapper.querySelector('.comic-page');
  const newPage = createPage(nextIndex);
  newPage.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
  wrapper.appendChild(newPage);

  newPage.getBoundingClientRect(); // 강제 리플로우

  requestAnimationFrame(() => {
    newPage.style.transform = 'translateX(0)';
    if (oldPage) oldPage.style.transform = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
  });

  setTimeout(() => {
    if (oldPage && oldPage.parentNode === wrapper) wrapper.removeChild(oldPage);
    newPage.style.position = 'relative';
    newPage.style.left = '0';
    newPage.style.transform = 'none';
    animating = false;
  }, 400);

  currentIndex = nextIndex;
  indexText.textContent = `${String(currentIndex + 1).padStart(2, '0')} — ${String(comics.length).padStart(2, '0')}`;
}

document.querySelector('.comic-nav button:first-child').addEventListener('click', () => {
  const next = (currentIndex - 1 + comics.length) % comics.length;
  slideTo(next, 'right');
});

document.querySelector('.comic-nav button:last-child').addEventListener('click', () => {
  const next = (currentIndex + 1) % comics.length;
  slideTo(next, 'left');
});

window.addEventListener('DOMContentLoaded', () => {
  const initial = createPage(currentIndex);
  initial.style.position = 'relative';
  initial.style.transform = 'none';
  wrapper.appendChild(initial);
  indexText.textContent = `01 — ${String(comics.length).padStart(2, '0')}`;
});
const comicDisplay = document.querySelector('.comic-display');
const comicNav = document.querySelector('.comic-nav');

if (comicDisplay && comicNav) {
  const comicObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        comicDisplay.classList.add('visible');
        comicNav.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.9
  });

  comicObserver.observe(comicDisplay); // 관측 대상은 그대로 comicDisplay
}

// ========================
// 웨이브 애니메이션 효과
// ========================
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

// ========================
// 웨이브 적용 시점
// ========================
window.addEventListener("DOMContentLoaded", () => {
  // 항상 웨이브: .wave-title.always
  document.querySelectorAll('.wave-title.always').forEach(title => {
    applyWaveEffect(title);
  });

  // 스크롤 등장 시 웨이브 애니메이션 적용 타이틀들
  const scrollWaveTitles = [
    { id: 'keyword-wave-title', animated: false },
    { id: 'team-wave-title', animated: false }
  ];

  const waveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const targetId = entry.target.id;
      const waveTarget = scrollWaveTitles.find(t => t.id === targetId);
      if (entry.isIntersecting && waveTarget && !waveTarget.animated) {
        applyWaveEffect(entry.target);
        waveTarget.animated = true;
        waveObserver.unobserve(entry.target); // 한 번만 실행
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40% 0px'
  });

  scrollWaveTitles.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) waveObserver.observe(el);
  });

  // 키워드 태그 박스 등장 애니메이션
  const keywordTags = document.querySelector('.keyword-tags');
  if (keywordTags) {
    const tagObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          keywordTags.classList.add('visible');
          observer.unobserve(entry.target); // 한 번만 실행
        }
      });
    }, {
      threshold: 0.8,
    });

    tagObserver.observe(keywordTags);
  }
});

 const memoryTips = [
    "충분한 수면은 기억 정리에 도움을 줘요.",
    "메모하거나 그림으로 정리해보세요.",
    "반복 복습이 장기기억에 효과적이에요.",
    "운동은 뇌 활동을 자극해 기억력을 향상시켜요.",
    "잠자기 전 복습은 기억에 오래 남아요.",
    "연결고리를 만들어 기억을 확장해보세요.",
    "소리 내어 말하면 기억에 더 오래 남습니다.",
    "냄새, 음악과 함께 기억하면 생생하게 떠올라요.",
    "호기심을 갖는 순간, 기억은 더 오래 갑니다.",
    "나만의 방식으로 재구성하면 잊기 어렵습니다.",
    "정보를 이야기로 만들어보세요. 스토리는 오래 남습니다.",
    "같은 내용을 다른 방식으로 표현해보세요.",
    "장소와 함께 기억하면 더 쉽게 떠올라요.",
    "관련된 이미지를 떠올리면 시각적 기억이 강화됩니다.",
    "마인드맵을 활용해 흐름을 시각화하세요.",
    "낯선 단어는 유사 발음으로 연상해보세요.",
    "정리하고 남에게 설명해보세요.",
    "자기 전에 '오늘 배운 것'을 떠올려보세요.",
    "실제 경험과 연결되면 기억이 단단해져요.",
    "손으로 쓰면 기억이 더 오래갑니다.",
    "게임처럼 문제를 만들어 풀어보세요.",
    "강조 표시나 색을 이용해 시각적으로 구분해보세요.",
    "감정을 담은 기억은 오래 남습니다.",
    "목표가 있으면 기억의 집중도가 높아집니다.",
    "소리, 이미지, 행동이 동시에 있으면 기억력이 강화돼요.",
    "특정 시간에 반복하면 뇌가 기억을 강화해요.",
    "집중 시간은 짧게, 쉬는 시간은 자주!",
    "심호흡과 명상은 뇌를 리셋해줘요.",
    "배운 내용을 직접 적용해보세요.",
    "처음과 마지막에 본 것이 더 잘 기억돼요.",
    "비슷한 내용을 비교하면 차이점이 기억에 남아요.",
    "머릿속으로 그려보는 시뮬레이션도 효과적이에요.",
    "타이머로 집중력을 높이고 기억력을 훈련하세요."
  ];

  // 현재 카드에 들어간 문구들
  let currentTips = [];

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function assignRandomTips() {
    currentTips = shuffle(memoryTips).slice(0, 3);
    document.querySelectorAll('.card-text').forEach((el, i) => {
      el.innerText = currentTips[i];
    });
  }

  function getNewTip(excludeList) {
    const candidates = memoryTips.filter(tip => !excludeList.includes(tip));
    if (candidates.length === 0) return null;
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  }

  document.addEventListener("DOMContentLoaded", () => {
    assignRandomTips();

    const cards = document.querySelectorAll('.card-item');
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        const currentText = currentTips[idx];
        const others = currentTips.filter((_, i) => i !== idx);
        const newTip = getNewTip(others);
        if (newTip) {
          card.querySelector('.card-text').innerText = newTip;
          currentTips[idx] = newTip;
        }
      });
    });
  });

  const cardGrid = document.querySelector('.card-grid');

if (cardGrid) {
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cardGrid.classList.add('visible');
        observer.unobserve(entry.target); // 한 번만
      }
    });
  }, {
    threshold: 0.3, // 스크롤 30% 보일 때
  });

  cardObserver.observe(cardGrid);
}
