import React, { useState, useEffect } from 'react';
import './App.css';
import { PlayerManager } from './components/PlayerManager';
import { GameSetup } from './components/GameSetup';
import { RotationView } from './components/RotationView';
import { LoadingScreen } from './components/LoadingScreen';
import { GameProvider } from './contexts/GameContext';

function App() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('coachCornerPlayers');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState('roster');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [gameRoster, setGameRoster] = useState([]);
  const [orderedRoster, setOrderedRoster] = useState([]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('coachCornerPlayers', JSON.stringify(players));
  }, [players]);

  if (loading) {
    return <LoadingScreen />;
  }

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

  const handleUpdateOrder = (newOrder) => {
    setOrderedRoster(newOrder);
  };

  const handleStartGame = () => {
    const roster = orderedRoster.length > 0 ? orderedRoster : players.filter(p => selectedPlayerIds.includes(p.id));
    setGameRoster(roster);
    setView('game');
  };

  return (
    <GameProvider>
      <div className="app">
        <header>
          <h1>🏀 CoachCorner</h1>
          <nav>
            <button onClick={() => setView('roster')} className={view === 'roster' ? 'active' : ''}>Team</button>
            <button onClick={() => setView('setup')} className={view === 'setup' ? 'active' : ''}>Game Setup</button>
            {gameRoster.length > 0 && (
              <button onClick={() => setView('game')} className={view === 'game' ? 'active' : ''}>Game Plan</button>
            )}
          </nav>
        </header>

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
              onStartGame={handleStartGame}
              onUpdateOrder={handleUpdateOrder}
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
    </GameProvider>
  );
}

export default App;
