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
