const express = require('express');
const partials = require('express-partials');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(partials());

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/host', (req, res) => {
  res.render('host.ejs');
});

app.get('/join', (req, res) => {
  res.render('join.ejs', { roomCode: req.query.roomCode });
});

const ytdl = require('ytdl-core');

app.get('/get-audio', (req, res) => {
  const requestUrl = `http://youtube.com/watch?v=${req.query.videoId}`;

  try {
    ytdl(requestUrl, { filter: 'audioonly' })
      .pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Listening on port ${PORT}`));

const socketIO = require('socket.io');

const io = socketIO(server);

const rooms = Array.from({ length: 10 }).fill([null, null]);
// setInterval(() => console.table(openRooms), 5000);

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    console.log(`Joining room "${room}"`);

    socket.join(room);

    if (
      room !== '000'
      && !rooms.filter(([roomCode]) => roomCode === room).length
    ) {
      rooms.pop();
      rooms.unshift([room, Date.now()]);
    }

    io.sockets.emit('room-info', Array.from(rooms));
  });

  socket.on('play', (room, data) => {
    console.log(`Playing video with ID "${data.videoId}" to room "${room}"`);

    socket.to(room).emit('play', data);
  });

  socket.on('pause', (room, data) => {
    console.log(`Pausing video in room "${room}"`);

    socket.to(room).emit('pause', data);
  });
});
