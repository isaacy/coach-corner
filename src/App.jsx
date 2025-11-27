import React, { useState, useEffect } from 'react';
import { PlayerManager } from './components/PlayerManager';
import { GameSetup } from './components/GameSetup';
import { RotationView } from './components/RotationView';

function App() {
  // Load players from local storage
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('coachCornerPlayers');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState('roster'); // 'roster', 'setup', 'game'
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [gameRoster, setGameRoster] = useState([]);
  const [orderedRoster, setOrderedRoster] = useState([]);

  useEffect(() => {
    localStorage.setItem('coachCornerPlayers', JSON.stringify(players));
  }, [players]);

  const addPlayer = (player) => {
    setPlayers([...players, player]);
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const editPlayer = (updatedPlayer) => {
    setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const togglePlayerSelection = (id) => {
    if (selectedPlayerIds.includes(id)) {
      setSelectedPlayerIds(selectedPlayerIds.filter(pid => pid !== id));
    } else {
      setSelectedPlayerIds([...selectedPlayerIds, id]);
    }
  };

  const updateOrder = (orderedList) => {
    setOrderedRoster(orderedList);
  };

  const startGame = () => {
    // Use the ordered list if available, otherwise fallback to filtered list (shouldn't happen if GameSetup works)
    const roster = orderedRoster.length > 0 ? orderedRoster : players.filter(p => selectedPlayerIds.includes(p.id));
    setGameRoster(roster);
    setView('game');
  };

  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CoachCorner
        </h1>
        <p className="text-sm">Fair Play Rotation Manager</p>
      </header>

      <nav style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          className={view === 'roster' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setView('roster')}
        >
          Team Roster
        </button>
        <button
          className={view === 'setup' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setView('setup')}
        >
          Game Setup
        </button>
      </nav>

      <main>
        {view === 'roster' && (
          <PlayerManager
            players={players}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onEditPlayer={editPlayer}
          />
        )}
        {view === 'setup' && (
          <GameSetup
            allPlayers={players}
            selectedPlayerIds={selectedPlayerIds}
            onToggleSelection={togglePlayerSelection}
            onStartGame={startGame}
            onUpdateOrder={updateOrder}
          />
        )}
        {view === 'game' && (
          <RotationView
            roster={gameRoster}
            onBack={() => setView('setup')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
