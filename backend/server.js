// backend/server.js
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS: local dev uses 3000, production = same origin
const corsOrigin = process.env.NODE_ENV === 'production' ? true : 'http://localhost:3000';
app.use(cors({ origin: corsOrigin, methods: ['GET', 'POST'] }));
app.use(express.json());

const io = new Server(server, {
  cors: { origin: corsOrigin, methods: ['GET', 'POST'] }
});

// --- in-memory game state ---
let game = {
  player: null,                // { name, avatarUrl }
  statements: ['', '', ''],    // [s1, s2, s3]
  votes: {},                   // { voterName: choiceIndex }
  timer: 60,
  interval: null,
  reveal: false,
  correctIndex: null
};

function resetVotes() {
  game.votes = {};
}

function startTimer(seconds = 60) {
  if (game.interval) clearInterval(game.interval);
  game.timer = seconds;
  game.interval = setInterval(() => {
    game.timer -= 1;
    io.emit('timerUpdate', game.timer);
    if (game.timer <= 0) {
      clearInterval(game.interval);
      game.interval = null;
      io.emit('timeUp', game.votes);
    }
  }, 1000);
}

// --- routes ---
app.post('/start', (req, res) => {
  const { name, avatarUrl, statements } = req.body;
  game.player = { name, avatarUrl };
  game.statements = statements || ['', '', ''];
  game.reveal = false;
  game.correctIndex = null;
  resetVotes();
  startTimer(60);
  io.emit('gameStarted', { player: game.player, statements: game.statements, timer: game.timer });
  res.send({ status: 'ok' });
});

app.get('/state', (req, res) => {
  res.send({
    player: game.player,
    statements: game.statements,
    votes: game.votes,
    timer: game.timer,
    reveal: game.reveal,
    correctIndex: game.correctIndex
  });
});

app.post('/vote', (req, res) => {
  const { voterName, choiceIndex } = req.body;
  if (!voterName || choiceIndex == null) return res.status(400).send({ error: 'bad' });
  if (!game.interval && game.timer <= 0) return res.status(400).send({ error: 'time' });
  game.votes[voterName] = Number(choiceIndex);
  io.emit('voteUpdate', game.votes);
  res.send({ status: 'ok' });
});

app.post('/reveal', (req, res) => {
  const { correctIndex } = req.body;
  game.correctIndex = Number(correctIndex);
  game.reveal = true;
  io.emit('reveal', game.correctIndex);
  res.send({ status: 'ok' });
});

// serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
