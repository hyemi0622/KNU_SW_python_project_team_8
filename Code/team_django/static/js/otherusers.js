// 실제 카드 데이터 배열 (uuid, keyword, summary)
let memoryCards = [];
// 각 row(줄)에 들어갈 카드 배열
let rowData = [[], [], [], []];
// 한 줄에 필요한 최소 카드 수 (필요시 더 크게 조정)
const minCards = 12;

// 실제 카드 생성 함수
function createCard(keyword, id, summary = "") {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.dataset.id = id;
  card.dataset.summary = summary;
  card.innerHTML = `
    <div class="memory-id">#${id}</div>
    <div class="memory-text">${keyword}</div>
  `;
  card.onclick = () => {
    document.getElementById("modalTitle").innerText = `#${id}`;
    document.getElementById("modalBody").innerText = summary || keyword;
    document.getElementById("cardModal").style.display = "flex";
  };
  return card;
}

// 빈 카드(플러스) 생성 함수 (필요시 사용)
function createEmptyCard() {
  const card = document.createElement("div");
  card.className = "memory-card empty-card";
  card.innerHTML = `
    <div class="memory-id">&nbsp;</div>
    <div class="memory-text">+</div>
  `;
  card.onclick = openKeywordModal;
  return card;
}

// 전체 카드 데이터를 4줄(row)로 분배
function splitRows(cards) {
  rowData = [[], [], [], []];
  cards.forEach((card, idx) => {
    rowData[idx % 4].push(card);
  });
}

// 카드가 부족하면 실제 카드 데이터를 반복해서 채움 (빈 카드 대신)
function fillCardsWithRepeats(cards, min) {
  if (cards.length === 0) return []; // 카드가 하나도 없으면 빈 배열 반환
  let filled = [...cards];
  while (filled.length < min) {
    filled.push(...cards.slice(0, Math.min(cards.length, min - filled.length)));
  }
  filled = filled.slice(0, min); // minCards만큼만 유지
  return filled;
}

// 각 row에 맞게 카드 렌더링 (좌우 흐름 유지, 빈 카드 대신 실제 카드 반복)
function renderRows() {
  for (let i = 0; i < 4; i++) {
    const row = document.querySelector(`.row-${i+1}`);
    row.innerHTML = '';
    // 카드가 부족하면 실제 카드 데이터를 반복해서 채움
    let cards = [...rowData[i]];
    if (cards.length < minCards) {
      cards = fillCardsWithRepeats(cards, minCards);
    }
    cards.forEach(card => {
      if (card.id === "empty") { // 혹시 빈 카드가 있으면 플러스 카드로 대체 (필요시)
        row.appendChild(createEmptyCard());
      } else {
        row.appendChild(createCard(card.keyword, card.id, card.summary));
      }
    });
  }
}

// 새 카드를 가장 카드가 적은 row에 추가
function addCardToRows(card) {
  let minRow = 0;
  for (let i = 1; i < 4; i++) {
    if (rowData[i].length < rowData[minRow].length) minRow = i;
  }
  rowData[minRow].push(card);
  renderRows();
}

// 키워드 입력 모달 띄우기
function openKeywordModal() {
  const keywordModal = document.getElementById("keywordModal");
  keywordModal.style.display = "flex";
  document.getElementById("keywordInput").value = "";
  setTimeout(() => document.getElementById("keywordInput").focus(), 100);

  document.getElementById("confirmSaveBtn").onclick = async () => {
    const keyword = document.getElementById("keywordInput").value.trim();
    if (keyword === "") {
      alert("키워드를 입력해주세요.");
      return;
    }
    const summary = summaryText; // summaryText가 최신인지 체크
    const saveResponse = await fetch("/polls/save_memory_record/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: answers.category,
        keyword: keyword,
        qa: followupQuestions.map((q, i) => ({
          question: q,
          answer: answers.responseList[i] || ""
        })),
        summary: summary
      })
    });
    const saveData = await saveResponse.json();
    keywordModal.style.display = "none";
    // 새 카드 추가
    memoryCards.push({ id: saveData.id, keyword: keyword, summary: summary });
    // rowData에 분배
    addCardToRows({ id: saveData.id, keyword: keyword, summary: summary });
    // 저장 완료 모달
    if (typeof showSaveCompleteModal === 'function') {
      showSaveCompleteModal(keyword, saveData.id);
    }
  };
}

// 서버에서 초기 데이터 불러오기
async function loadInitialData() {
  try {
    const response = await fetch("/polls/get_memory_records/");
    const data = await response.json();
    // data가 배열이고, 각 요소가 {id, keyword, summary} 구조인지 확인
    console.log("서버에서 받은 데이터:", data);
    memoryCards = data;
    splitRows(memoryCards);
    renderRows();
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
  }
}

// 카드 흐름 애니메이션
function scrollFadeEffect() {
  const rows = document.querySelectorAll(".card-row");
  rows.forEach(row => {
    const cards = row.querySelectorAll(".memory-card");
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const isFullyVisible = rect.left >= 0 && rect.right <= window.innerWidth;
      card.style.opacity = isFullyVisible ? 1 : 0.3;
    });
  });
  requestAnimationFrame(scrollFadeEffect);
}

// 타이틀 웨이브 효과
function applyWaveEffect(title) {
  if (!title) return;
  const nodes = Array.from(title.childNodes);
  let i = 0;
  title.innerHTML = "";
  nodes.forEach(node => {
    if (node.nodeType === 3) {
      const chars = node.textContent.split("");
      chars.forEach(char => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.classList.add("wave-letter");
        span.style.animationDelay = `${i * 0.08}s`;
        title.appendChild(span);
        i++;
      });
    } else if (node.nodeType === 1 && node.tagName === "BR") {
      title.appendChild(document.createElement("br"));
    }
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  // 모달 닫기
  document.querySelector(".close-button").onclick = () => {
    document.getElementById("cardModal").style.display = "none";
  };
  // ESC로 모달 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("cardModal").style.display = "none";
    }
  });
  // 타이틀 웨이브 효과
  const title = document.querySelector(".gray-section");
  applyWaveEffect(title);
  // 초기 데이터 로딩
  loadInitialData();
  // 카드 흐름 애니메이션 시작
  scrollFadeEffect();
});
