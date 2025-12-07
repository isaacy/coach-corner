import React, { useReducer, useState } from 'react';
import { scoreKeeperReducer, initialState } from '../logic/scoreKeeperReducer';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './ScoreKeeper.css';

/* Quick inline Sortable Item for players in Setup Phase if we want reordering, 
   but for now we focus on the main grid functionality. 
   Actually, let's keep it simple first as per plan: functional score keeping.
*/

export function ScoreKeeper() {
    const [state, dispatch] = useReducer(scoreKeeperReducer, initialState);
    const [activeTab, setActiveTab] = useState('home'); // 'home' | 'guest'
    const [isSetup, setIsSetup] = useState(true); // Initial setup mode to enter specific players if needed

    // Temp state for adding players
    const [newPlayerNumber, setNewPlayerNumber] = useState('');
    const [newPlayerName, setNewPlayerName] = useState('');

    const activeTeam = activeTab === 'home' ? state.homeTeam : state.guestTeam;
    const activeTeamKey = activeTab;

    const handleAddPlayer = (e) => {
        e.preventDefault();
        if (!newPlayerNumber) return;
        dispatch({
            type: 'ADD_PLAYER',
            team: activeTeamKey,
            number: newPlayerNumber,
            name: newPlayerName || `Player`
        });
        setNewPlayerNumber('');
        setNewPlayerName('');
    };

    return (
        <div className="score-keeper">
            {/* Scoreboard Header */}
            <div className="scoreboard card">
                <div className="score-row flex-between">
                    <div className={`team-score ${activeTab === 'home' ? 'active-team' : ''}`} onClick={() => setActiveTab('home')}>
                        <div className="team-name">{state.homeTeam.name}</div>
                        <div className="big-score">{state.homeTeam.score}</div>
                        <div className="stat-label">Fouls: {state.homeTeam.fouls} | TO: {state.homeTeam.timeouts}</div>
                    </div>

                    <div className="game-info">
                        <div className="period-display">PERIOD <span className="period-number">{state.period}</span></div>
                        <div className="timer-placeholder">--:--</div>
                    </div>

                    <div className={`team-score ${activeTab === 'guest' ? 'active-team' : ''}`} onClick={() => setActiveTab('guest')}>
                        <div className="team-name">{state.guestTeam.name}</div>
                        <div className="big-score">{state.guestTeam.score}</div>
                        <div className="stat-label">Fouls: {state.guestTeam.fouls} | TO: {state.guestTeam.timeouts}</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="game-controls flex-between" style={{ marginBottom: '1rem' }}>
                <button className="btn-secondary btn-sm" onClick={() => dispatch({ type: 'TIMEOUT', team: activeTab })}>
                    Timeout {activeTeam.name}
                </button>
                <button className="btn-secondary btn-sm" onClick={() => dispatch({ type: 'NEXT_PERIOD' })}>
                    Next Period
                </button>
                <button className="btn-secondary btn-sm" onClick={() => dispatch({ type: 'RESET_FOULS' })}>
                    Reset Team Fouls
                </button>
            </div>

            {/* Roster / Action Area */}
            <div className="roster-area">
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}>
                        HOME ROSTER
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'guest' ? 'active' : ''}`}
                        onClick={() => setActiveTab('guest')}>
                        GUEST ROSTER
                    </button>
                </div>

                <div className="player-list">
                    {activeTeam.players.length === 0 && (
                        <div className="empty-state">
                            <p>No players added yet.</p>
                        </div>
                    )}

                    {activeTeam.players.map(player => (
                        <div key={player.id} className="score-player-card card">
                            <div className="flex-between">
                                <div className="player-identity">
                                    <span className="jersey-number">#{player.number}</span>
                                    <span className="player-name-mod">{player.name}</span>
                                </div>
                                <div className="player-stats-mini">
                                    PTS: <strong>{player.points}</strong> | FLS: <span className={player.fouls >= 5 ? 'danger-text' : ''}>{player.fouls}</span>
                                </div>
                            </div>

                            <div className="action-row">
                                <div className="score-actions">
                                    <button className="btn-score" onClick={() => dispatch({ type: 'ADD_SCORE', team: activeTeamKey, playerId: player.id, points: 1 })}>+1</button>
                                    <button className="btn-score" onClick={() => dispatch({ type: 'ADD_SCORE', team: activeTeamKey, playerId: player.id, points: 2 })}>+2</button>
                                    <button className="btn-score" onClick={() => dispatch({ type: 'ADD_SCORE', team: activeTeamKey, playerId: player.id, points: 3 })}>+3</button>
                                </div>
                                <button className="btn-foul" onClick={() => dispatch({ type: 'ADD_FOUL', team: activeTeamKey, playerId: player.id })}>
                                    FOUL ({player.fouls})
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add Player Inline */}
                    <form onSubmit={handleAddPlayer} className="add-player-form card" style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <div className="flex-between">
                            <input
                                type="number"
                                placeholder="#"
                                value={newPlayerNumber}
                                onChange={(e) => setNewPlayerNumber(e.target.value)}
                                style={{ width: '60px', marginRight: '10px' }}
                            />
                            <input
                                type="text"
                                placeholder="Player Name"
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                style={{ flexGrow: 1, marginRight: '10px' }}
                            />
                            <button type="submit" className="btn-icon" disabled={!newPlayerNumber}>+</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* History Log */}
            <div className="history-log card">
                <h3>Game Log</h3>
                <div className="log-entries">
                    {state.history.map(entry => (
                        <div key={entry.id} className="log-entry text-sm">
                            {entry.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
