document.addEventListener("DOMContentLoaded", () => {
  // ✅ 상태 변수
  let isTyping = false;

  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const intro = document.getElementById("intro");
  const messageContainer = document.getElementById("chatMessages");
  const messagesInner = document.getElementById("messagesInner");
  const scrollBtn = document.getElementById("scrollToBottom");
  const startCard = document.getElementById("startCard");

  function sendMessage() {
    const message = input.value.trim();

    if (message === "" || isTyping) {
      if (message === "") shakeInput();
      return;
    }

    // ✅ 첫 채팅 시 intro 숨김 + 채팅 영역 표시
    if (intro.style.display !== "none") {
      intro.style.display = "none";
      messageContainer.style.display = "flex";
    }

    // ✅ 상태 변경 및 버튼 UI 변경
    isTyping = true;
    sendBtn.innerHTML = `<span class="square-dot"></span>`;

    // ✅ 사용자 메시지 생성
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.innerText = message;
    messagesInner.appendChild(userMsg);

    // ✅ AI 자리 생성
    const aiMsg = document.createElement("div");
    aiMsg.className = "message ai typing";
    aiMsg.innerHTML = `<span class="ai-typing-indicator">●</span>`;
    messagesInner.appendChild(aiMsg);

    scrollToBottom();

    // ✅ 3.2초 후 AI 응답 교체
    setTimeout(() => {
      aiMsg.classList.remove("typing");
      aiMsg.innerHTML = "안녕, 윤희! 😊<br>무엇을 도와드릴까?";
      isTyping = false;
      sendBtn.innerHTML = "↑";
      scrollToBottom();
    }, 3200);

    input.value = "";
  }

  // ✅ 흔들림 효과
  function shakeInput() {
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 300);
  }

  // ✅ 부드럽게 스크롤 아래로
  function scrollToBottom() {
    messageContainer.scrollTo({
      top: messageContainer.scrollHeight,
      behavior: "smooth"
    });
  }

  // ✅ 전송 버튼 & 엔터 키 이벤트
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // ✅ 하단 이동 버튼 클릭 이벤트
  scrollBtn.addEventListener("click", scrollToBottom);

  // ✅ 스크롤 시 하단 버튼 표시 여부
  messageContainer.addEventListener("scroll", () => {
    const isNotAtBottom =
      messageContainer.scrollHeight - messageContainer.scrollTop >
      messageContainer.clientHeight + 50;

    scrollBtn.classList.toggle("show", isNotAtBottom);
  });

  // ✅ 시작카드 클릭 시 자동입력 + 전송
  if (startCard) {
    startCard.addEventListener("click", () => {
      input.value = "시작";
      sendBtn.click();
    });
  }
});

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
    showCopiedToast(); // ✅ alert 대신 사용자 정의 토스트
  });
});
