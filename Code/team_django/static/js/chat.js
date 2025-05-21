


const cardData = [
    {
      title: "기분이 좋아지는 립스틱 💄",
      desc: "분홍 립스틱은 입술뿐만 아니라 기분도 핑크핑크하게 만들어 줍니다.",
      tags: "✨ 이 기억이 포함된 키워드: #핑크 #PINK #행복"
    },
    {
      title: "좋아했던 풍경 🌅",
      desc: "저녁노을 속에서 함께 걷던 그 길. 따뜻한 기억이 남아있어요.",
      tags: "✨ 이 기억이 포함된 키워드: #노을 #산책 #그때그시절"
    },
    {
      title: "추억의 음악 🎶",
      desc: "그 노래가 나오면 언제나 떠오르는 순간이 있어요.",
      tags: "✨ 이 기억이 포함된 키워드: #노래 #음악 #그때"
    },
    {
      title: "소중했던 편지 ✉️",
      desc: "한 글자 한 글자에 마음이 담긴 편지를 아직도 간직하고 있어요.",
      tags: "✨ 이 기억이 포함된 키워드: #편지 #따뜻함 #소중함"
    }
  ];
  
  let currentPage = 0;
  const cardsPerPage = 2;
  const cardContainer = document.getElementById('cardContainer');
  const indexSpan = document.getElementById('card-index');
  
  function renderCards() {
    cardContainer.innerHTML = '';
    const start = currentPage * cardsPerPage;
    const visibleCards = cardData.slice(start, start + cardsPerPage);
  
    visibleCards.forEach(card => {
      const div = document.createElement('div');
      div.className = 'memory-card active';
      div.innerHTML = `
        <div class="box">
          <h4>${card.title}</h4>
          <p>${card.desc}</p>
          <p>${card.tags}</p>
        </div>`;
      cardContainer.appendChild(div);
    });
  
    const totalPages = Math.ceil(cardData.length / cardsPerPage);
    indexSpan.textContent = `${String(currentPage + 1).padStart(2, '0')} — ${String(totalPages).padStart(2, '0')}`;
  }
  
  function changeCard(direction) {
    const totalPages = Math.ceil(cardData.length / cardsPerPage);
    currentPage = (currentPage + direction + totalPages) % totalPages;
    renderCards();
  }
  
  renderCards();
  
  // ✅ 진행 바 로직
  let currentQuestion = 0;
  const totalQuestions = 15;
  const progressBar = document.getElementById('progress-bar');
  
  function nextQuestion() {
    if (currentQuestion < totalQuestions) {
      currentQuestion++;
      const percent = (currentQuestion / totalQuestions) * 100;
      progressBar.style.width = `${percent}%`;
    }
  }