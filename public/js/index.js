const socket = io();
socket.emit('join', '000');

let latestData = [[null, null]];

const updateData = (data) => {
  latestData = data;

  document.querySelector('#sessionsTable').innerHTML = '';

  data.forEach(([room, openedDate]) => {
    if (!room) return;

    document.querySelector('#sessionsTable').innerHTML +=
      `<li>${room} \
         <span class="opened-time">\
           ${Math.round((Date.now() - openedDate) / 1000 / 60)}m ago\
         </span>\
       </li>`;
  });
};

setInterval(() => updateData(latestData), 60000);

socket.on('connect', () =>
  socket.on('room-info', (data) => updateData(data))
);