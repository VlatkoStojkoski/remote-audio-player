const express = require('express');
const partials = require('express-partials');
const socket = require('socket.io');

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
    console.error(errr);
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Listening on port ${PORT}`));

const io = socket(server);

io.on('connection', socket => {
  socket.on('join', (room) => {
    socket.join(room);
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