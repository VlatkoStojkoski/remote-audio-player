/* global roomCode, socket */
document
  .querySelector('#playBtn')
  .addEventListener('click',
    () => socket.emit('play', roomCode, {
      videoId: document.querySelector('#videoID').value,
    }));

document.querySelector('#pauseBtn').addEventListener('click', () => socket.emit('pause', roomCode));
