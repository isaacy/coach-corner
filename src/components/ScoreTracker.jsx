import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

export function ScoreTracker() {
    const { gameState, addScore, undoLastScore } = useGame();
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);

    if (!gameState.isLive) return null;

    const handleScore = (points) => {
        if (selectedPlayerId) {
            addScore(selectedPlayerId, points);
            setSelectedPlayerId(null);
        }
    };

    const quarter = Math.floor(gameState.currentPeriod / 2) + 1;
    const currentQuarterScore = gameState.score.byQuarter[quarter - 1];

    return (
        <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem'
        }}>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Score Tracker</h3>

            {/* Current Score */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Team</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>
                        {gameState.score.team}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        Q{quarter}: {currentQuarterScore.team}
                    </div>
                </div>
                <div style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>-</div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Opponent</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                        {gameState.score.opponent}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        Q{quarter}: {currentQuarterScore.opponent}
                    </div>
                </div>
            </div>

            {/* Undo Button */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button
                    onClick={undoLastScore}
                    style={{
                        fontSize: '0.8rem',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--text-secondary)',
                        color: 'var(--text-secondary)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}
                >
                    <span>↩</span> Undo Last Score
                </button>
            </div>

            {/* Player Selection */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Who scored?
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {gameState.activePlayers.map(player => (
                        <button
                            key={player.id}
                            onClick={() => setSelectedPlayerId(player.id)}
                            style={{
                                padding: '0.5rem',
                                backgroundColor: selectedPlayerId === player.id ? 'var(--accent-orange)' : 'var(--bg-primary)',
                                border: `2px solid ${selectedPlayerId === player.id ? 'var(--accent-orange)' : 'var(--border-color)'}`,
                                borderRadius: 'var(--radius-md)',
                                color: selectedPlayerId === player.id ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                        >
                            #{player.number}
                        </button>
                    ))}
                    <button
                        onClick={() => setSelectedPlayerId('opponent')}
                        style={{
                            padding: '0.5rem',
                            backgroundColor: selectedPlayerId === 'opponent' ? 'var(--danger)' : 'var(--bg-primary)',
                            border: `2px solid ${selectedPlayerId === 'opponent' ? 'var(--danger)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--radius-md)',
                            color: selectedPlayerId === 'opponent' ? 'white' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        OPP
                    </button>
                </div>
            </div>

            {/* Score Buttons */}
            {selectedPlayerId && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    <button
                        onClick={() => handleScore(1)}
                        className="btn-secondary"
                        style={{ fontSize: '1.2rem', padding: '1rem' }}
                    >
                        +1
                    </button>
                    <button
                        onClick={() => handleScore(2)}
                        className="btn-primary"
                        style={{ fontSize: '1.2rem', padding: '1rem' }}
                    >
                        +2
                    </button>
                    <button
                        onClick={() => handleScore(3)}
                        className="btn-primary"
                        style={{ fontSize: '1.2rem', padding: '1rem', backgroundColor: 'var(--success)' }}
                    >
                        +3
                    </button>
                </div>
            )}
        </div>
    );
}
