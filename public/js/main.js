document.querySelector('#roomCode').innerText = roomCode;
document.title = `Room: ${roomCode}`;

const socket = io();
socket.emit('join', roomCode);