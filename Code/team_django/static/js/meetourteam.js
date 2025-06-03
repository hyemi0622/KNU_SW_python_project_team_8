let currentIndex = 0; // 첫 번째 카드가 기본 활성화

function updateSlider() {
  const cards = document.querySelectorAll('.card');
  const dots = document.querySelectorAll('.dot');
  cards.forEach((card, idx) => {
    card.classList.remove('active');
    card.style.opacity = 0.28;
    card.style.transform = 'scale(0.95)';
    card.style.zIndex = 1;
    card.style.pointerEvents = 'auto'; // 클릭 가능하게!
  });
  cards[currentIndex].classList.add('active');
  cards[currentIndex].style.opacity = 1;
  cards[currentIndex].style.transform = 'scale(1.06)';
  cards[currentIndex].style.zIndex = 2;
  // 카드 중앙 정렬
  const slider = document.getElementById('slider');
  const cardWidth = cards[0].offsetWidth + 28;
  slider.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
  // dot indicator
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

function prevSlide() {
  const cards = document.querySelectorAll('.card');
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateSlider();
}

function nextSlide() {
  const cards = document.querySelectorAll('.card');
  currentIndex = (currentIndex + 1) % cards.length;
  updateSlider();
}

// 카드 클릭 시 해당 카드로 이동
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (currentIndex !== idx) {
        currentIndex = idx;
        updateSlider();
      }
    });
  });

  // dot 클릭 지원
  document.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      if (currentIndex !== idx) {
        currentIndex = idx;
        updateSlider();
      }
    });
  });

  // 좌우 키로 슬라이드 이동
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  updateSlider();
});
