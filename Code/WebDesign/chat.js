document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if (message === "") return;

  const messageContainer = document.querySelector(".chat-messages");

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = message;
  messageContainer.appendChild(userMsg);

  // Simulated AI response
  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  aiMsg.innerText = "안녕, 윤희! 😊\n무엇을 도와드릴까?";
  messageContainer.appendChild(aiMsg);

  input.value = "";
  messageContainer.scrollTop = messageContainer.scrollHeight;
});
