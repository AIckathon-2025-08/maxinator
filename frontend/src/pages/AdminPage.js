// frontend/src/pages/AdminPage.js
import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [statements, setStatements] = useState(['', '', '']);
  const [correctIndex, setCorrectIndex] = useState('');

  const startGame = async () => {
    await axios.post(`${API}/start`, { name, avatarUrl, statements });
  };

  const reveal = async () => {
    if (correctIndex === '') return;
    await axios.post(`${API}/reveal`, { correctIndex: Number(correctIndex) });
  };

  return (
    <div className="page page--admin">
      <div className="card">
        <h1 className="title">Maxinator — Admin</h1>

        <label className="label">Player name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Player name" />

        <label className="label">Avatar URL</label>
        <input className="input" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." />

        <div className="stack">
          {statements.map((s, i) => (
            <input
              key={i}
              className="input"
              placeholder={`Statement ${i + 1}`}
              value={s}
              onChange={e => {
                const next = [...statements];
                next[i] = e.target.value;
                setStatements(next);
              }}
            />
          ))}
        </div>

        <button className="btn btn--accent" onClick={startGame}>Start 60s Timer</button>
      </div>

      <div className="card">
        <h2 className="subtitle">Reveal</h2>
        <select className="input" value={correctIndex} onChange={e => setCorrectIndex(e.target.value)}>
          <option value="">Select the lie</option>
          <option value={0}>Statement 1</option>
          <option value={1}>Statement 2</option>
          <option value={2}>Statement 3</option>
        </select>
        <button className="btn btn--danger" onClick={reveal}>Reveal the Lie</button>
      </div>
    </div>
  );
}
