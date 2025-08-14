// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';

const KITTENS = [
  'https://placekitten.com/160/160','https://placekitten.com/161/160','https://placekitten.com/162/160',
  'https://placekitten.com/163/160','https://placekitten.com/164/160','https://placekitten.com/165/160',
  'https://placekitten.com/166/160','https://placekitten.com/167/160','https://placekitten.com/168/160',
  'https://placekitten.com/169/160','https://placekitten.com/170/160','https://placekitten.com/171/160',
  'https://placekitten.com/160/161','https://placekitten.com/161/161','https://placekitten.com/162/161',
  'https://placekitten.com/163/161','https://placekitten.com/164/161','https://placekitten.com/165/161',
  'https://cataas.com/cat/gif','https://cataas.com/cat/gif?s=1','https://cataas.com/cat/gif?s=2'
];

export default function App() {
  return (
    <div className="app">
      <Router>
        <header className="nav">
          <div className="nav__brand">Maxinator</div>
          <nav className="nav__links">
            <NavLink className="nav__link" to="/admin">Admin</NavLink>
            <NavLink className="nav__link" to="/vote">Vote</NavLink>
            <NavLink className="nav__link" to="/results">Results</NavLink>
          </nav>
        </header>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Router>

      <div className="kittens" aria-hidden="true">
        {KITTENS.concat(KITTENS).map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" />
        ))}
      </div>
    </div>
  );
}
