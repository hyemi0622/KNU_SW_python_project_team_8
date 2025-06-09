  
  
  
  
function showSaveCompleteModal(keyword, id) {
  const modal = document.getElementById('saveCompleteModal');
  const body = document.getElementById('saveCompleteModalBody');
  body.innerHTML = `<div style="font-size:18px; font-weight:600; margin-bottom:12px;">Save complete</div>
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

    //  GPT 요약 응답 출력
    const doneMsg = document.createElement("div");
    doneMsg.className = "message ai";
    doneMsg.innerText = data.summary || "모든 질문이 완료되었습니다. 감사합니다.";
    messagesInner.appendChild(doneMsg);
    scrollToBottom();




  
    //  "답변을 저장할까요?" 버튼 만들기
  const saveBtn = document.createElement("button");
  saveBtn.className = "save-button";
  saveBtn.innerText = "Save response?";
  saveBtn.onclick = () => {
  const keywordPrompt = document.createElement("div");
  keywordPrompt.className = "message ai";
  keywordPrompt.innerHTML = `
    <label>저장할 키워드를 입력하세요 (50자 이내) 📩 </label><br>
    <input type="text" id="keywordInput" maxlength="50" placeholder="예: 서울여행, 깜빡한 단어" style="margin-top: 8px; width: 80%; padding: 6px; border-radius: 6px; border: 1px solid #ccc;">
    <button id="confirmSaveBtn" style="margin-left: 10px;">save</button>
  `;
  messagesInner.appendChild(keywordPrompt);
  scrollToBottom();

  document.getElementById("confirmSaveBtn").onclick = async () => {
    const keyword = document.getElementById("keywordInput").value.trim();
    if (keyword === "") {
      alert("키워드를 입력해주세요.");
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
        summary: data.summary
      })
    });

    const saveData = await saveResponse.json();
showSaveCompleteModal(keyword, saveData.id);
  };
};

messagesInner.appendChild(saveBtn);
scrollToBottom();





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

  // ✅ '시작' 입력 시 버튼 포함한 카테고리 안내
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
    "그 장소에 도착했을 때 먼저 보였던 게 무엇인가요? ( 문, 간판, 사람, 불빛 등)",
    "그 장소를 냄새로 표현한다면 어떤 냄새인가요?",
    "그 장소에서 걷고 있었나요? 앉아 있었나요? 누워 있었나요?",
    "그 장소에서 마지막으로 했던 행동은 뭐였나요? ( 인사하기, 계산하기, 사진 찍기 등)",
    "그 장소는 어느 나라에 있나요?",
    "그 장소는 어느 지역에 있나요? ( 울산, 서울, 대구 등)",
    "그 장소에 사람들이 많이 모여있었나요?",
    "지금 그 기억을 떠올리면 어떤 감정이 드나요?",
    "그 장소에서 특별히 기억나는 소리가 있나요?",
    "그 장소에 함께 있었던 사람이 누구인가요? (연인, 친구, 가족, 혼자 등)",
    "그 장소 주변에 유명한 랜드마크나 건물이 있나요?(이름도 알려주세요)",
    "그 장소에서 주로 사용하는 교통수단이 무엇이 있나요?",
    "그 장소에 주로 어떤 활동을 하러 가나요?(음악 감상, 만들기 등등)"
  ],
  2: [
    "그 일정의 시간대가 기억나시나요?(아침/오후/저녁/밤 중에서)",
    "그 일정은 '해야만 하는' 일인가요, 아니면 '하고 싶은' 일이었나요?",
    "해당 일정은 어떤 종류였나요?→ (수업 / 과제 / 회의 / 식사약속 / 여행 / 알바 / 기타)",
    "누구와 잡은 일정인가요??(친구, 가족, 혼자 등등)",
    "최근에 알림, 캘린더, 노션, 종이 메모 등에서 알림이 왔는데 무시한 적이 있나요?",
    "그 일정에 대해 가장 최근에 얘기한 적 있나요? 어떤 내용이었나요?",
    "그 일정과 관련된 자기관리 계획이 있었나요? (예: 목표, 루틴, 리마인더 등)",
    "누군가 요즘 “너 그거 챙겼어?” “까먹지 말고~” 같은 말을 한 기억이 있나요?",
    "평소 같으면 이쯤에 정기적으로 있는 일정이 있었나요?",
    "학교, 회사, 알바 , 기타 중 어디에 해당하나요?"
  ],
  3: [
    "어떤 상황에서 그 단어를 사용하나요?",
    "한국어였나요, 외국어였나요?",
    "그 단어가 고유 명사,속담, 고사성어 중에 어떤 종류 인가요?",
    "그 단어를 사용할 때 기분이나 감정은 어땠나요?",
    "지금 떠오르는 단어 중 비슷하지만 아닌게 있나요?",
    "그 단어는 명사, 동사, 형용사 중 어떤 품사였나요? 아니면 문장 자체였나요?",
    "누군가가 자주 썼던 말인가요? 그렇다면 누구인가요?",
    "뉴스, 책, 영화 중 어디서 접했던 단어였나요?",
    "그 단어의 첫 글자나 음절이 기억나나요?",
    "어떤 소리나 음악, 리듬과 연결된 느낌이 있나요?",
    "단어를 들었을 때 머릿속에 어떤 이미지가 떠오르나요?",
    "해당 단어는 일상적인가요, 아니면 특정 분야(예: 법, IT, 의학 등)의 전문용어인가요?",
    "그 단어를 써야 하는데 비슷한 다른 단어로 대체했던 적 있나요?",
    "그 단어를 마지막으로 썼거나 들었던 장소나 상황은 어디였나요?"
  ],
  4: [
     "영화,드라마, 애니메이션, 책 중 어느 것이 적어주세요.",
    "어떤 장르였나요? (예: 액션, 로맨스, 공포, 범죄 등)",
    "등장하는 배우 또는 성우 이름이 기억나나요? 주연,조연 가리지 말고 전부 적어주세요.",
    "방영 연도는 언제쯤인가요? (예: 2010~2014년 사이)",
    "어느 나라에서 제작된 작품인가요?",
    "당시에 관객 수나 인기 정도가 기억나시나요? (예: 100만 미만)",
    "작품에서 가장 기억에 남는 장면이 있었나요? 주연,조연 가리지 말고 전부 적어주세요.",
    "이 작품를 처음 접한 경로는? (극장, OTT, TV, 유튜브 광고 등)",
    "등장인물의 캐릭터 이름이 기억 나시나요?",
    "배경이 현실인가요? 판타지인가요? Q12 작품 속 등장한 장소를 생각 나는 대로 전부 적어주세요. (예: 교도소,학교 , 카페, 항구..)",
    "작품에서 등장한 대사가 기억나세요?",
    "작가,감독,제작사 중에 아는 것이 있으시면 적어주세요.",
    "작품의 결말이 기억 나시나요?(예: 주인공이 희생함.)",
  ],
  5: [
    "노래의 장르는 무엇인가요? (발라드, 힙합, 팝송,트로트 등)",
    "그룹인가요? 솔로 인가요?",
    "그룹이나 가수의 이름을 적어주세요.",
    "가사의 일부가 무엇인가요?",
    "노래가 나왔던 시기가 언제쯤인가요?",
    "어디서 이 노래를 자주 들으셨나요?",
    "노래방 인기차트에서 본 적 있나요?",
    "노래와 관련된 특정 사람이나 장소가 기억나나요?",
    "노래에 챌린지가 있나요?",
    "노래 제목이 한글인가요,영어인가요, 둘 다인가요?",
    "노래의 후렴구 멜로디가 입에 맴돌거나 흥얼거리게 되었나요?",
    "관련된 키워드가 있다면 무엇인가요?",
    "유사한 노래가 있다면 어떤 곡인가요?",
    "해당 노래는 앨범의 타이틀곡이었나요?",
  ],
  6: [
    "검색하기 직전에 어떤 일을 하고 있었어?",
    "이동 중이였어? 컴퓨터 앞에 앉아 있었어? (장소를 말해주세요)",
    "검색하려던 건 어떤 주제 였나요?",
    "그때 머릿속에 떠오른 단어나 이미지가 있나요?",
    "지금 검색하는 장소가 어딘가요?",
    "이 기억을 찾고 그 후에 하려던 일이나 일정이 기억나나요?",
    "검색 전에 연락하고 있었나요? 누구와 어떤 연락을 하고 있었나요?",
    "소비와 관련 있었나요?(쇼핑, 외식 , 주식,...)",
    "검색 하려던게 사실을 확인 하려던 건가요? ( 루머나 정보 검증 )",
    "검색하려던 단어의 일부라도 생각 나시나요?",
    "검색 하려던게 주변 사람에 의해 부탁 받은 일인가요?",
    "비슷한 말 떠오르는 거 아무거나 말해주세요.",
    "하고 있던 과제나 일이 있다면 어떤 내용인가요?",
    "검색하려는 당시의 기분을 적어주세요."
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


