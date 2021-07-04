/* global socket */

document.querySelector('body').addEventListener('click', () => {
  const allowSoundModal = document.querySelector('.allow-sound-modal');
  allowSoundModal.parentElement.removeChild(allowSoundModal);

  document.querySelector('.modal-bg').classList.add('hide');
}, { once: true });

const audio = new Audio();

socket.on('connect', () => {
  socket.on('play', ({ videoId }) => {
    if (!(audio.paused && audio.currentSrc.endsWith(videoId))) { audio.src = `/get-audio?videoId=${videoId}`; }
    audio.play();

    console.log(`Playing audio "${videoId}"`);
  });

  socket.on('pause', () => {
    audio.pause();

    console.log('Pausing audio');
  });
});
