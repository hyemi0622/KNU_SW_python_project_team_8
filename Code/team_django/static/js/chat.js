let followupQuestions = [];
let currentQuestionIndex = 0;
let answers = [];
let selectedCategory = "";
let selectedSubcategory = "";

//api호출 부분
async function submitAnswers() {
  const input = document.querySelector(".chat-input input");
  input.value = "";

  const qaPairs = followupQuestions.map((q, i) => ({
    question: `Q${i + 2}. ${q}`,
    answer: answers[i] || ""
  }));

  console.log("QA 쌍:", qaPairs);

  try {
    const res = await fetch("/polls/process_answers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        qa: qaPairs
      })
    });

    const data = await res.json();
    console.log("🎯 GPT 응답 요약:", data);

    const chatBox = document.querySelector(".chat-box");

    if (data && typeof data.summary === "string" && data.summary.trim() !== "") {
      const responseDiv = document.createElement("div");
      responseDiv.classList.add("message", "bot");
      responseDiv.innerHTML = `
        <img src="/static/images/bot.png" alt="Bot" />
        <div class="message-content">
          <strong>🤖 GPT 응답:</strong><br>${data.summary.replace(/\n/g, "<br>")}
        </div>
      `;
      chatBox.appendChild(responseDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      // 응답은 왔는데 내용이 없음
      renderErrorBubble(chatBox);
    }

  } catch (error) {
    console.error("❗ GPT fetch 오류:", error);
    const chatBox = document.querySelector(".chat-box");
    renderErrorBubble(chatBox);
  }
}

// 에러 말풍선 함수
function renderErrorBubble(chatBox) {
  const botDiv = document.createElement("div");
  botDiv.classList.add("message", "bot");
  botDiv.innerHTML = `
    <img src="/static/images/bot.png" alt="Bot" />
    <div class="message-content">
      <strong>❗ GPT 응답 실패:</strong><br>결과를 받아오지 못했습니다.<br>잠시 후 다시 시도해 주세요.
    </div>
  `;
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}


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
  
  // 진행 바 로직
  let currentQuestion = 0;
  const totalQuestions = 15;
  const progressBar = document.getElementById('progress-bar');
  
  
 
  function nextQuestion() {
    

    const input = document.querySelector(".chat-input input");
    const answer = input.value.trim();
    if (answer === "") return;
  
    // 사용자 답변 출력
    const chatBox = document.querySelector(".chat-box");
    const userDiv = document.createElement("div");
    userDiv.classList.add("message", "user");
    userDiv.innerHTML = `
      <img src="/static/images/user.png" alt="User" />
      <div class="message-content">${answer}</div>
    `;
    chatBox.appendChild(userDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  
    // 답변 저장 + 입력창 초기화
    answers.push(answer);
    input.value = "";
  
    // 질문 끝났으면 GPT 호출 후 종료
    if (currentQuestionIndex >= followupQuestions.length - 1) {
      console.log(" 마지막 질문입니다. GPT 호출 시작!");//테스트 코드 

      submitAnswers();
      return;
    }
    
  
    // 다음 질문 출력
    currentQuestionIndex++;
  
    const q = followupQuestions[currentQuestionIndex];
    const botDiv = document.createElement("div");
    botDiv.classList.add("message", "bot");
    botDiv.innerHTML = `
      <img src="/static/images/bot.png" alt="Bot" />
      <div class="message-content">Q${currentQuestionIndex + 2}: ${q}</div>
    `;
    chatBox.appendChild(botDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  
    // 진행바 갱신
    const percent = (currentQuestionIndex / followupQuestions.length) * 100;
    progressBar.style.width = `${percent}%`;
  }
  
  

  function showMemoryCategoryQuestion() {
    const chatBox = document.querySelector(".chat-box");
  
    // 로봇 질문 (왼쪽)
    const botDiv = document.createElement('div');
    botDiv.classList.add('message', 'bot');
    botDiv.innerHTML = `
      <img src="/static/images/bot.png" alt="Bot" />
      <div class="message-content">
        <p><strong>Q1)</strong> 어떤 기억을 잃어버리셨나요?</p>
      </div>
    `;
    chatBox.appendChild(botDiv);
  
    // 사용자 체크리스트 (오른쪽)
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'user');
    userDiv.innerHTML = `
      <img src="/static/images/user.png" alt="User" />
      <div class="message-content">
        <p>아래 항목 중 하나를 선택해 주세요.</p>
        <form id="memoryForm">
          <label><input type="radio" name="memory" value="장소/경험" /> 장소/경험</label><br>
          <label><input type="radio" name="memory" value="일정/할일" /> 일정/할일</label><br>
          <label><input type="radio" name="memory" value="단어" /> 단어</label><br>
          <label><input type="radio" name="memory" value="콘텐츠" /> 콘텐츠 (영화/책/드라마/노래)</label><br>
          <label><input type="radio" name="memory" value="꿈" /> 꿈</label><br>
          <label><input type="radio" name="memory" value="기타" /> 기타</label><br><br>
          <button type="button" onclick="submitMemoryCategory()">선택 완료</button>
        </form>
      </div>
    `;
    chatBox.appendChild(userDiv);
  
    //  스크롤 아래로
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  

  // 질문 리스트를 가져오는 함수
async function fetchQuestions(category, subcategory = "") {
  const res = await fetch("/polls/get_followup_questions/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, subcategory })
  });
  
  const data = await res.json();
  return data.questions;


  console.log("🔥 질문 목록:", data.questions);

}

// 카테고리 선택 시 실행할 함수
async function handleCategorySelection() {
  const category = "콘텐츠";
  const subcategory = "영화";

  const questions = await fetchQuestions(category, subcategory);
  console.log(questions);
    // 이후 첫 질문 표시 → nextQuestion()
}


async function startQuestions(category, subcategory = "") {
  selectedCategory = category;
  selectedSubcategory = subcategory;

  const questions = await fetchQuestions(category, subcategory);
  followupQuestions = questions;
  currentQuestionIndex = 0;
  answers = [];

  showNextQuestion();  // 첫 질문 보여줌
}






let lastBotDiv = null;  // 말풍선 저장용 전역 변수 (파일 상단에 선언 필요)

function showNextQuestion() {
  const chatBox = document.querySelector(".chat-box");

  if (currentQuestionIndex >= followupQuestions.length) {
    submitAnswers();  // 모든 질문 끝났을 때 처리
    return;
  }

  const q = followupQuestions[currentQuestionIndex];
  const botDiv = document.createElement("div");
  botDiv.classList.add("message", "bot");
  botDiv.innerHTML = `
    <img src="/static/images/bot.png" alt="Bot" />
    <div class="message-content">Q${currentQuestionIndex + 2}: ${q}</div>
  `;
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  lastBotDiv = botDiv;  // ⬅️ GPT 응답을 이 div에 붙일 수 있게 저장
  document.querySelector(".chat-input input").value = "";
}








function submitMemoryCategory() {
  const selected = document.querySelector('input[name="memory"]:checked');
  if (!selected) {
    alert("하나를 선택해 주세요!");
    return;
  }

  const value = selected.value;
  let subcategory = "";

  if (value === "콘텐츠") subcategory = "영화"; // 기본값
  else if (value === "일정/할일") subcategory = "학교"; // 기본값
  //  단어, 꿈, 기타 등은 subcategory = ""로 유지

  console.log("✅ 카테고리 선택됨:", value, "/", subcategory);
  startQuestions(value, subcategory);
}



