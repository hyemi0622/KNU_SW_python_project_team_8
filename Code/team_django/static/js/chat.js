function updateGlobalClickCount(action) {
  fetch('/polls/update_global_click/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: action }) // action: "save" 또는 "dont_save"
  })
  .then(res => res.json())
  .then(data => {
    // 필요시 카운트 표시 등
    // console.log(data);
  });
}
  




document.addEventListener("DOMContentLoaded", function() {
  // "Save" 버튼과 "Not Save" 버튼에 클릭 이벤트 연결
  const saveBtn = document.getElementById("modalSaveBtn");
  const dontSaveBtn = document.getElementById("modalNotSaveBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", function() {
      updateGlobalClickCount("save");
    });
  }
  if (dontSaveBtn) {
    dontSaveBtn.addEventListener("click", function() {
      updateGlobalClickCount("dont_save");
    });
  }
});



function showGptResponseModal(summaryText) {
  const modal = document.getElementById("gptResponseModal");
  const modalBody = document.getElementById("gptResponseModalBody");
  const messagesInner = document.getElementById("messagesInner");
  if (!modal || !modalBody || !messagesInner) return;

  // 줄바꿈 문자(\r\n, \n 등)를 <br> 태그로 변환
  const formattedText = (summaryText || "응답이 없습니다.")
    .replace(/(\r\n|\n|\r)/g, '<br>');

  modalBody.innerHTML = formattedText;
  modal.style.display = "flex";

  const modalSaveBtn = document.getElementById("modalSaveBtn");
  const modalNotSaveBtn = document.getElementById("modalNotSaveBtn");

  // 중복 이벤트 방지: 기존 핸들러 제거
  modalSaveBtn.onclick = null;
  modalNotSaveBtn.onclick = null;

  modalSaveBtn.onclick = () => {
    updateGlobalClickCount("save");







    modal.style.display = "none";

  

  // 키워드 입력 모달 띄우기
  const keywordModal = document.getElementById("keywordModal");
  keywordModal.style.display = "flex";
  document.getElementById("keywordInput").value = ""; // 입력창 초기화
  setTimeout(() => document.getElementById("keywordInput").focus(), 100);

document.getElementById("confirmSaveBtn").onclick = async () => {
  const keyword = document.getElementById("keywordInput").value.trim();
  if (keyword === "") {
    alert("키워드를 입력해주세요.");
    return;
  }
  // 사용자가 입력한 번호 가져오기
  const numberInput = document.getElementById("numberInput");
  const selectedNumber = parseInt(numberInput.value, 10);
  if (!selectedNumber || selectedNumber < 1 || selectedNumber > 5) {
    alert("1~5 사이의 번호를 입력해주세요.");
    return;
  }
  // summaryText에서 해당 번호 항목만 추출
  const items = extractNumberedItems(summaryText);
  const summary = items[selectedNumber - 1] || "";
  if (!summary) {
    alert(selectedNumber + "번 항목이 없습니다.");
    return;
  }

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
  addCardToRows({ id: saveData.id, keyword: keyword, summary: summary });
  showSaveCompleteModal(keyword, saveData.id);
};
};

  modalNotSaveBtn.onclick = () => {
    updateGlobalClickCount("dont_save");
    modal.style.display = "none";
  
  
 
  
  
  // 메모리 게임 이동 여부 모달 띄우기
  const memoryGameModal = document.getElementById("memoryGameModal");
  memoryGameModal.style.display = "flex";

  // OK 버튼: memorygame 페이지로 이동
  document.getElementById("goMemoryBtn").onclick = () => {
    window.location.href = "/polls/memorygame/";
  };

  // No 버튼: 메인 홈(index)으로 이동
  document.getElementById("goHomeBtn").onclick = () => {
    window.location.href = "/polls/index";
  };
};
}

function extractNumberedItems(summaryText) {
  // 1. ~ 5.으로 시작하는 줄만 추출
  const lines = summaryText.split(/\r?\n/);
  const items = [];
  for (let line of lines) {
    const match = line.match(/^\s*([1-5])\.\s*(.+)$/);
    if (match) {
      items[parseInt(match[1], 10) - 1] = match[2].trim();
    }
  }
  return items;
}

function showSaveCompleteModal(keyword, id) {
  const modal = document.getElementById('saveCompleteModal');
  const body = document.getElementById('saveCompleteModalBody');
  body.innerHTML = `<div style="font-size:18px; font-weight:600; margin-bottom:12px;">Save complete 📥</div>
    <div>Keyword: <b>${keyword}</b></div>
    <div style="margin-top:8px; color:#888;">ID: ${id}</div>`;
  modal.style.display = 'flex';
}

function closeSaveCompleteModal() {
  document.getElementById('saveCompleteModal').style.display = 'none';
}

async function submitAnswers() {
  const messagesInner = document.getElementById("messagesInner");

  // 질문과 답변을 묶어 qa 리스트 생성
  const qaList = followupQuestions.map((question, index) => ({
    question: question,
    answer: answers.responseList[index] || ""
  }));

  //  서버에 보낼 전체 데이터 구성
  const payload = {
    category: answers.category,
    subcategory: "",  // 필요하면 여기에 값 추가
    qa: qaList
  };

  try {
    //  Django 서버에 POST
    const response = await fetch("/polls/process_answers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
     const doneMsg = document.createElement("div");
    doneMsg.className = "message ai";
    doneMsg.innerText = "모든 질문이 완료되었습니다. 감사합니다. 🤝";
    messagesInner.appendChild(doneMsg);

    //  GPT 요약 응답 출력
    showGptResponseModal(data.summary);
    scrollToBottom();

console.log("서버 응답:", data);
  } catch (error) {
    console.error("❌ 에러 발생:", error);
    const errorMsg = document.createElement("div");
    errorMsg.className = "message ai";
    errorMsg.innerText = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    messagesInner.appendChild(errorMsg);
    scrollToBottom();
  }
}


  //  상태 변수
  let isTyping = false;
  let selectedCategory = "";
  let followupQuestions = [];
  let currentQuestionIndex = 0;
  let answers = {
    category: "",
    responseList: []
  };
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const intro = document.getElementById("intro");
  const messageContainer = document.getElementById("chatMessages");
  const messagesInner = document.getElementById("messagesInner");
  const scrollBtn = document.getElementById("scrollToBottom");
  const startCard = document.getElementById("startCard");

  function scrollToBottom() {
  const messageContainer = document.getElementById("chatMessages");
  if (messageContainer) {
    messageContainer.scrollTo({
      top: messageContainer.scrollHeight,
      behavior: "smooth"
    });
  }
}
window.scrollToBottom = scrollToBottom;  // 이 줄 추가!
  function sendMessage() {
    console.log("currentQuestionIndex:", currentQuestionIndex, "followupQuestions.length:", followupQuestions.length);
  const message = input.value.trim();

  if (message === "" || isTyping) {
    if (message === "") shakeInput();
    return;
  }

  if (intro.style.display !== "none") {
    intro.style.display = "none";
    messageContainer.style.display = "flex";
  }

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = message;
  messagesInner.appendChild(userMsg);
  scrollToBottom();

  input.value = "";

  // '시작' 입력 시 버튼 포함한 카테고리 안내
  if (message === "시작") {
  isTyping = true;
  sendBtn.innerHTML = `<span class="square-dot"></span>`;

  // 1. 타이핑 인디케이터
  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai typing";
  aiMsg.innerHTML = `<span class="ai-typing-indicator">●</span>`;
  messagesInner.appendChild(aiMsg);
  scrollToBottom();

  setTimeout(() => {
    // 2. 안내문 텍스트로 교체 (점 위치와 정확히 일치)
    aiMsg.classList.remove("typing");
    aiMsg.innerHTML = `찾고 싶은 기억을 선택해주세요. 🧠`;
    aiMsg.classList.add("first-question"); // 필요시

    // 3. 버튼 묶음은 별도의 .message.ai div로 추가 (아래에 붙음)
    const btnDiv = document.createElement("div");
    btnDiv.className = "message ai first-question";
    btnDiv.innerHTML = `
      <div class="category-buttons">
        <button onclick="selectCategory(1)">1. 장소</button>
        <button onclick="selectCategory(2)">2. 일정/할일</button>
        <button onclick="selectCategory(3)">3. 단어/문장</button>
        <button onclick="selectCategory(4)">4. 콘텐츠</button>
        <button onclick="selectCategory(5)">5. 노래</button>
        <button onclick="selectCategory(6)">6. 검색</button>
      </div>
    `;
    messagesInner.appendChild(btnDiv);

    scrollToBottom();

    isTyping = false;
    sendBtn.innerHTML = "↑";
  }, 3200);

  return;
}



  
  // ✅ 숫자 1~5 입력으로 카테고리 선택
  if (!selectedCategory && /^[1-6]$/.test(message)) {
    const categoryMap = {
      1: "장소",
      2: "일정/할일",
      3: "단어/문장",
      4: "콘텐츠",
      5: "노래",
      6: "검색"
    };
    selectedCategory = categoryMap[message];
    startQuestions(selectedCategory);
    return;
  }

  // ✅ 질문에 대한 답변 처리 (카테고리 선택 후에만 작동)
  if (
    selectedCategory !== "" &&
    followupQuestions.length > 0 &&
    currentQuestionIndex < followupQuestions.length
  ) {
    answers.responseList.push(message); // ✨ 답변 저장
    currentQuestionIndex++;
    showNextQuestion();
    return;
  }
}

  function shakeInput() {
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 300);
  }


  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  scrollBtn.addEventListener("click", scrollToBottom);

  messageContainer.addEventListener("scroll", () => {
    const isNotAtBottom =
      messageContainer.scrollHeight - messageContainer.scrollTop >
      messageContainer.clientHeight + 50;

    scrollBtn.classList.toggle("show", isNotAtBottom);
  });

  if (startCard) {
    startCard.addEventListener("click", () => {
      input.value = "시작";
      sendBtn.click();
    });
  }
});

function selectCategory(num) {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  input.value = String(num);
  sendBtn.click();
}

function showCopiedToast() {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = "복사됨";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

document.querySelector(".share-button").addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showCopiedToast();
  });
});

// ✅ 질문 데이터 (로컬에서 직접 사용)
const questionBank = {
  1: [
    "그 장소는 실내였나요, 실외였나요?",
    "관광지였나요? 산이나 바다 같은 자연 속이었나요?",
    "어느 나라였나요? (예: 한국 경상북도 상주시)",
    "그 장소에 랜드마크가 있다면 말해주세요.",
    "어떤 이유로 그 장소를 방문하셨나요?",
    "뉴스에서 그 장소를 본 적이 있나요?",
    "그 장소에 지하철이 있었나요?",
    "그 장소에 있었을 때 날씨는 어땠나요?",
    "그 장소에서 기억에 남는 사건이나 행동은 무엇인가요? (50자 이내로 작성)",
    "그 장소의 특산물은 무엇이었나요?",
    "그 장소에서 특별한 행사가 있었나요?",
    "그 장소 출신의 유명인이 있다면 말해주세요.",
    "그 장소 주변에서 기억나는 상호명이나 간판이 있나요?",
    "그 장소에 함께 있었던 사람은 누구였나요?"
  ],
  2: 
    [
      "그 일정은 아침, 오후, 저녁, 밤 중 언제였나요?",
      "그 일정은 꼭 해야 했던 일인가요, 하고 싶었던 일이었나요?",
      "그 일정은 어떤 유형이었나요? (과제, 약속, 여행, 회의 등)",
      "오늘 식사 약속이 있으신가요?",
      "함께했던 사람이 있다면 누구였나요?",
      "그 일정은 반복되는 일정이었나요? (정기 모임, 수업, 회사 등)",
      "해당 일정은 어떤 알림 수단으로 관리했나요? (캘린더, 노션 등)",
      "지금 무엇을 하고 계셨나요?",
      "그 일정은 친구나 가족과의 사적인 약속인가요, 회사나 알바 같은 공적인 일인가요?",
      "어제 했던 일을 적어주세요.",
      "일정을 놓쳐서 곤란했던 적이 있었나요?",
      "최근 검색했던 키워드를 나열해주세요.",
      "그 일정에 대해 다른 사람과 대화한 적이 있나요?",
      "당신의 업무 또는 전공에 대해 말해주세요."
    ],
  3: [
    "그 단어를 들었거나 사용했던 상황은 어떤 상황이었나요?",
    "그 단어는 어떤 언어였나요? (한국어, 영어, 스페인어 등)",
    "그 단어의 품사(명사, 동사, 형용사 등)를 기억하나요?",
    "그 단어가 들어간 문장이나 구절이 기억나시나요?",
    "단어의 첫 글자나 음절이 기억나시나요?",
    "그 단어를 자주 사용하던 사람이 있었나요? 있다면 누구였나요?",
    "그 단어는 특정 상표였나요?",
    "그 단어는 전문 용어였나요?",
    "그 단어가 나왔던 콘텐츠(책, 뉴스, 영화 등)가 있었나요?",
    "비슷하지만 정확히는 아닌 단어가 있다면 어떤 것인가요?",
    "그 단어를 찾으면 어디에 사용하려고 했나요?",
    "그 단어를 검색해본 적이 있나요?",
    "그 단어와 관련된 감정이나 분위기는 어떤가요?",
    "그 단어를 누군가에게 설명한 적이 있나요?"
  ]
  ,
  4: [
    "영화, 드라마, 애니메이션, 책 중 무엇이었나요?",
    "어떤 장르였나요? (예: 액션, 로맨스, 공포, 범죄, 스릴러 등)",
    "등장하는 배우나 성우의 실제 이름이 기억나시나요? (주연, 조연 모두 포함)",
    "방영 연도는 언제쯤이었나요? (예: 2010~2014년 사이)",
    "어느 나라에서 제작된 작품인가요?",
    "당시 관객 수나 인기도가 기억나시나요? (예: 100만 미만)",
    "작품에서 가장 기억에 남는 장면이 있었나요? (주연, 조연 모두 포함)",
    "이 작품을 접한 경로는 어디인가요? (극장, OTT, TV, 유튜브 광고 등)",
    "등장인물의 캐릭터 이름이 기억나시나요?",
    "배경이 현실이었나요, 판타지였나요? 등장 장소를 전부 적어주세요. (예: 교도소, 학교, 카페, 항구 등)",
    "작품에서 기억나는 대사가 있나요?",
    "전체적인 스토리를 간단히 적어주세요.",
    "작품의 결말이 기억나시나요? (예: 주인공이 희생함)"
  ]
  ,
  5:[
    "노래의 장르는 무엇인가요? (발라드, 힙합, 팝송, 트로트 등)",
    "그룹인가요, 솔로 가수인가요?",
    "가수나 그룹 이름을 적어주세요.",
    "가사 중 일부가 기억나시나요?",
    "노래가 나왔던 시기는 언제쯤인가요?",
    "어디에서 이 노래를 자주 들었나요?",
    "노래방 인기 차트에서 본 적이 있나요?",
    "가수의 연령대는 어떻게 되나요?",
    "이 노래에 챌린지가 있었나요?",
    "노래 제목은 한글인가요, 영어인가요, 둘 다인가요?",
    "작곡가나 피처링 가수 이름을 알고 있나요?",
    "관련된 키워드가 있다면 적어주세요.",
    "비슷한 느낌의 노래가 있다면 어떤 곡인가요?",
    "특정 계절이나 장소와 관련 있다면 적어주세요."
  ],
  6: [
    "검색하기 직전에 무엇을 하고 있었나요?",
    "이동 중이었나요, 컴퓨터 앞에 앉아 있었나요?",
    "검색하려던 주제는 무엇이었나요? (음식, 지명, 고사성어 등)",
    "그때 머릿속에 떠오른 단어나 이미지가 있었나요?",
    "검색했던 장소는 어디였나요?",
    "기억을 찾은 후 어떤 일을 하려고 했나요?",
    "최근 검색창에 입력했던 단어들을 나열해주세요.",
    "검색하려던 것이 소비와 관련 있었나요? (쇼핑, 외식, 주식 등)",
    "사실 확인을 위한 검색이었나요? (루머, 정보 검증 등)",
    "검색하려던 단어의 일부라도 기억나나요?",
    "누군가의 부탁으로 검색하려던 것이었나요?",
    "비슷한 말이 떠오른다면 무엇인가요?",
    "당시 하고 있던 과제나 일의 내용은 무엇이었나요?",
    "검색 당시 기분은 어땠나요?"
  ]
  
};


async function fetchQuestions(category) {
  const reverseCategoryMap = {
    "장소": 1,
    "일정/할일": 2,
    "단어/문장": 3,
    "콘텐츠": 4,
    "노래": 5,
    "검색": 6
  };
  const key = reverseCategoryMap[category.trim()];
  console.log("선택된 category:", category);
  console.log("질문 목록:", questionBank[key]);
  return questionBank[key] || [];
}

//  질문 시작
async function startQuestions(category) {
  followupQuestions = await fetchQuestions(category);
  currentQuestionIndex = 0;
  answers = {
    category: category,
    responseList: []
  };
  showNextQuestion();
}

function showNextQuestion() {

  console.log("currentQuestionIndex:", currentQuestionIndex);
  console.log("followupQuestions:", followupQuestions);
  console.log("followupQuestions.length:", followupQuestions.length);

  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (currentQuestionIndex >= followupQuestions.length) {
    console.log("질문 끝! submitAnswers로 이동");
    submitAnswers();
    return;
  }
  isTyping = true;
  input.disabled = false;
  sendBtn.disabled = true;
  sendBtn.innerHTML = `<span class="square-dot"></span>`; 
  const q = followupQuestions[currentQuestionIndex];
  console.log("이번에 출력할 질문:", q);
  const messagesInner = document.getElementById("messagesInner");

  // 1. typing indicator 추가
  const typingDiv = document.createElement("div");
  typingDiv.className = "message ai typing";
  typingDiv.innerHTML = `<span class="ai-typing-indicator">●</span>`;
  messagesInner.appendChild(typingDiv);
  scrollToBottom();

  // 2. 잠시 후 질문으로 교체
  setTimeout(() => {
    typingDiv.classList.remove("typing");
    typingDiv.innerText = q;
    scrollToBottom();
    isTyping = false;
    input.disabled = false;
    sendBtn.disabled = false;
    sendBtn.innerHTML = "↑";
    input.focus();
  }, 1800);
}

function closeKeywordModal() {
  document.getElementById("keywordModal").style.display = "none";
}