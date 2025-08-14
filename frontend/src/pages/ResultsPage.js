// frontend/src/pages/ResultsPage.js
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

export default function ResultsPage() {
  const [player, setPlayer] = useState(null);
  const [statements, setStatements] = useState([]);
  const [votes, setVotes] = useState({});
  const [reveal, setReveal] = useState(false);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    axios.get('http://localhost:5001/state').then(({ data }) => {
      setPlayer(data.player);
      setStatements(data.statements || []);
      setVotes(data.votes || {});
      setReveal(Boolean(data.reveal));
      setCorrectIndex(data.correctIndex);
      setTimer(data.timer);
    });
  }, []);

  useEffect(() => {
    socket.on('gameStarted', g => {
      setPlayer(g.player);
      setStatements(g.statements);
      setVotes({});
      setReveal(false);
      setCorrectIndex(null);
      setTimer(g.timer);
    });
    socket.on('voteUpdate', v => setVotes(v));
    socket.on('timeUp', v => setVotes(v));
    socket.on('reveal', idx => {
      setCorrectIndex(idx);
      setReveal(true);
    });
    socket.on('timerUpdate', t => setTimer(t));
    return () => {
      socket.off('gameStarted');
      socket.off('voteUpdate');
      socket.off('timeUp');
      socket.off('reveal');
      socket.off('timerUpdate');
    };
  }, []);

  const buckets = useMemo(() => {
    const b = [[], [], []];
    Object.entries(votes).forEach(([voter, idx]) => {
      if (idx >= 0 && idx < 3) b[idx].push(voter);
    });
    return b;
  }, [votes]);

  const total = Object.keys(votes).length;

  return (
    <div className="page page--results">
      <div className="card">
        <h1 className="title">Maxinator — Results</h1>
        <div className="timer">{timer > 0 ? `${timer}s left` : 'Voting closed'}</div>

        {!player ? (
          <div className="muted">Waiting for the admin to start…</div>
        ) : (
          <>
            <div className="profile">
              <img className="avatar" src={player.avatarUrl} alt="avatar" />
              <div className="name">{player.name}</div>
            </div>

            <div className="grid">
              {statements.map((s, i) => {
                const isLie = reveal && i === correctIndex;
                return (
                  <div key={i} className={`panel ${isLie ? 'panel--correct' : ''}`}>
                    <div className="panel__title">Statement {i + 1}</div>
                    <div className="panel__body">{s}</div>
                    <div className="panel__count">{buckets[i].length} vote(s)</div>
                    <div className="panel__voters">
                      {buckets[i].length === 0 ? (
                        <span className="muted">No voters</span>
                      ) : (
                        buckets[i].map(v => <span key={v} className="chip">{v}</span>)
                      )}
                    </div>
                    {isLie && <div className="ribbon">Lie</div>}
                  </div>
                );
              })}
            </div>

            <div className="total">Total votes: {total}</div>
            {reveal && correctIndex != null && (
              <div className="badge badge--reveal">Lie: Statement {correctIndex + 1}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
