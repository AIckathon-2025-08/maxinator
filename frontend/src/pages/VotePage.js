// frontend/src/pages/VotePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
const SOCKET_URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5001';
const socket = io(SOCKET_URL);

export default function VotePage() {
  const [player, setPlayer] = useState(null);
  const [statements, setStatements] = useState([]);
  const [timer, setTimer] = useState(60);
  const [voterName, setVoterName] = useState('');
  const [choice, setChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [correctIndex, setCorrectIndex] = useState(null);

  useEffect(() => {
    axios.get(`${API}/state`).then(({ data }) => {
      setPlayer(data.player);
      setStatements(data.statements || []);
      setTimer(data.timer);
      setReveal(Boolean(data.reveal));
      setCorrectIndex(data.correctIndex);
    });
  }, []);

  useEffect(() => {
    socket.on('gameStarted', g => {
      setPlayer(g.player);
      setStatements(g.statements);
      setTimer(g.timer);
      setSubmitted(false);
      setChoice(null);
      setReveal(false);
      setCorrectIndex(null);
    });
    socket.on('timerUpdate', t => setTimer(t));
    socket.on('timeUp', () => setSubmitted(true));
    socket.on('reveal', idx => { setReveal(true); setCorrectIndex(idx); });
    return () => {
      socket.off('gameStarted');
      socket.off('timerUpdate');
      socket.off('timeUp');
      socket.off('reveal');
    };
  }, []);

  const submit = async () => {
    if (!voterName || choice == null) return;
    await axios.post(`${API}/vote`, { voterName, choiceIndex: choice });
    setSubmitted(true);
  };

  return (
    <div className="page page--vote">
      <div className="card">
        <h1 className="title">Maxinator — Vote</h1>
        <div className="timer">{timer > 0 ? `${timer}s left` : 'Time is up'}</div>
        {!player ? (
          <div className="muted">Waiting for the admin to start…</div>
        ) : (
          <>
            <div className="profile">
              <img className="avatar" src={player.avatarUrl} alt="avatar" />
              <div className="name">{player.name}</div>
            </div>

            <input className="input" placeholder="Your name" value={voterName}
              onChange={e => setVoterName(e.target.value)} disabled={submitted || timer === 0} />

            <div className="stack">
              {statements.map((s, i) => (
                <label key={i} className={`option ${choice === i ? 'option--selected' : ''}`}>
                  <input type="radio" name="vote" value={i}
                    onChange={() => setChoice(i)} disabled={submitted || timer === 0} />
                  <span>{s}</span>
                </label>
              ))}
            </div>

            {!submitted ? (
              <button className="btn btn--primary" onClick={submit} disabled={timer === 0}>Submit Vote</button>
            ) : <div className="muted">Vote submitted</div>}

            {reveal && correctIndex != null && (
              <div className="badge badge--reveal">Lie: Statement {correctIndex + 1}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
