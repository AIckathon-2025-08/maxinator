// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let game = {
  player: null,            // { name, avatarUrl }
  statements: [],          // [str, str, str]
  votes: {},               // { voterName: choiceIndex }
  timer: 60,               // seconds
  reveal: false,           // boolean
  correctIndex: null       // 0|1|2|null
};
let timerInterval = null;

app.get('/', (_, res) => res.send('Maxinator backend running'));

app.get('/state', (_, res) => {
  res.json(game);
});

app.post('/start', (req, res) => {
  const { name, avatarUrl, statements } = req.body;
  if (!name || !avatarUrl || !Array.isArray(statements) || statements.length !== 3) {
    return res.status(400).send({ error: 'Invalid data' });
  }

  game = {
    player: { name, avatarUrl },
    statements,
    votes: {},
    timer: 60,
    reveal: false,
    correctIndex: null
  };

  io.emit('gameStarted', game);

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (game.timer > 0) {
      game.timer -= 1;
      io.emit('timerUpdate', game.timer);
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      io.emit('timeUp', game.votes);
    }
  }, 1000);

  res.send({ status: 'ok' });
});

app.post('/vote', (req, res) => {
  const { voterName, choiceIndex } = req.body;
  if (!voterName || choiceIndex == null || choiceIndex < 0 || choiceIndex > 2) {
    return res.status(400).send({ error: 'Invalid vote' });
  }
  game.votes[voterName] = choiceIndex;
  io.emit('voteUpdate', game.votes);
  res.send({ status: 'ok' });
});

app.post('/reveal', (req, res) => {
  const { correctIndex } = req.body;
  if (correctIndex == null || correctIndex < 0 || correctIndex > 2) {
    return res.status(400).send({ error: 'Invalid index' });
  }
  game.correctIndex = correctIndex;
  game.reveal = true;
  io.emit('reveal', correctIndex);
  res.send({ status: 'ok' });
});

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
