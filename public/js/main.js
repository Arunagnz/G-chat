const socket = io();
const list = document.querySelector(".chat-messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("msg");

const name = prompt("What is your name?");
socket.emit("connected", name);

socket.on("bot", (message) => {
  appendMessage("Bot : " + message);
});

socket.on("user-connect", (name) => {
  appendMessage(`${name} has joined`);
});

socket.on("user-disconnect", (name) => {
  appendMessage(`${name} has left`);
});

socket.on("message", (data) => {
  appendMessage(`${data.name} : ${data.message}`);
});

socket.on("my-message", (data) => {
  appendMyMessage(`${data.name} : ${data.message}`);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) {
    return false;
  }
  socket.emit("chat-msg", message);
  input.value = "";
  input.focus();
  socket.emit("my-msg", message);
});

const appendMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message;
  div.appendChild(para);
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
};

const appendMyMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("my-message");
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message;
  div.appendChild(para);
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
};
