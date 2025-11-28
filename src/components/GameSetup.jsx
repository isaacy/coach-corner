import React, { useState, useEffect } from 'react';
import { ROTATIONS } from '../logic/rotationPatterns';

export function GameSetup({ allPlayers, selectedPlayerIds, onToggleSelection, onStartGame, onUpdateOrder }) {
    const [step, setStep] = useState(1); // 1: Select, 2: Order
    const [orderedPlayers, setOrderedPlayers] = useState([]);
    const [swapSourceIndex, setSwapSourceIndex] = useState(null);

    useEffect(() => {
        // Sync orderedPlayers with selection
        const currentIds = orderedPlayers.map(p => p.id);
        const newIds = selectedPlayerIds.filter(id => !currentIds.includes(id));
        const removedIds = currentIds.filter(id => !selectedPlayerIds.includes(id));

        let newList = [...orderedPlayers];
        if (removedIds.length > 0) {
            newList = newList.filter(p => !removedIds.includes(p.id));
        }
        if (newIds.length > 0) {
            const newPlayers = allPlayers.filter(p => newIds.includes(p.id));
            newList = [...newList, ...newPlayers];
        }

        // Only update if actually changed to avoid loops
        if (newList.length !== orderedPlayers.length || !newList.every((p, i) => p.id === orderedPlayers[i]?.id)) {
            setOrderedPlayers(newList);
            onUpdateOrder(newList);
        }
    }, [selectedPlayerIds, allPlayers]);

    const handleNext = () => {
        if (selectedPlayerIds.length < 5) {
            alert("Please select at least 5 players.");
            return;
        }
        setStep(2);
    };

    const handlePlayerClick = (index) => {
        if (swapSourceIndex === null) {
            setSwapSourceIndex(index);
        } else {
            // Swap
            if (swapSourceIndex !== index) {
                const newList = [...orderedPlayers];
                const temp = newList[swapSourceIndex];
                newList[swapSourceIndex] = newList[index];
                newList[index] = temp;
                setOrderedPlayers(newList);
                onUpdateOrder(newList);
            }
            setSwapSourceIndex(null);
        }
    };

    const starters = orderedPlayers.slice(0, 5);
    const bench = orderedPlayers.slice(5);

    if (step === 1) {
        return (
            <div className="card">
                <h2>Select Roster</h2>
                <p className="text-sm" style={{ marginBottom: '1rem' }}>Select players for today's game (Min 5)</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {allPlayers.map(player => {
                        const isSelected = selectedPlayerIds.includes(player.id);
                        return (
                            <div
                                key={player.id}
                                onClick={() => onToggleSelection(player.id)}
                                className={`player-card ${isSelected ? 'selected' : ''}`}
                                style={{
                                    cursor: 'pointer',
                                    border: isSelected ? '2px solid var(--success)' : '2px solid transparent',
                                    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)'
                                }}
                            >
                                <div className="jersey-number">{player.number}</div>
                                <div className="player-name">{player.firstName}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-between">
                    <span>{selectedPlayerIds.length} selected</span>
                    <button
                        className="btn-primary"
                        disabled={selectedPlayerIds.length < 5}
                        onClick={handleNext}
                    >
                        Next →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2>Set Lineup</h2>
                <button className="btn-secondary" onClick={() => setStep(1)} style={{ fontSize: '0.8rem' }}>Back</button>
            </div>

            <p className="text-sm" style={{ marginBottom: '1rem' }}>
                Tap a player to select, then tap another to swap positions.
                <br />
                <span style={{ color: 'var(--success)' }}>Top 5 are Starters.</span>
            </p>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🏀</span> STARTERS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {starters.map((player, i) => (
                        <div
                            key={player.id}
                            onClick={() => handlePlayerClick(i)}
                            className="player-card"
                            style={{
                                cursor: 'pointer',
                                borderLeft: '4px solid var(--success)',
                                backgroundColor: swapSourceIndex === i ? 'rgba(245, 132, 38, 0.2)' : 'var(--bg-secondary)',
                                border: swapSourceIndex === i ? '2px solid var(--accent-orange)' : 'none',
                                borderLeft: swapSourceIndex === i ? '4px solid var(--accent-orange)' : '4px solid var(--success)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)', width: '24px', fontSize: '0.8rem' }}>{i + 1}</span>
                                <div className="jersey-number" style={{ fontSize: '1.2rem', marginRight: '1rem' }}>{player.number}</div>
                                <div className="player-name" style={{ flex: 1 }}>{player.firstName}</div>
                                <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--success)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>START</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🪑</span> BENCH
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {bench.map((player, i) => {
                        const realIndex = i + 5;
                        return (
                            <div
                                key={player.id}
                                onClick={() => handlePlayerClick(realIndex)}
                                className="player-card"
                                style={{
                                    cursor: 'pointer',
                                    borderLeft: '4px solid var(--text-secondary)',
                                    backgroundColor: swapSourceIndex === realIndex ? 'rgba(245, 132, 38, 0.2)' : 'rgba(0,0,0,0.2)',
                                    border: swapSourceIndex === realIndex ? '2px solid var(--accent-orange)' : 'none',
                                    borderLeft: swapSourceIndex === realIndex ? '4px solid var(--accent-orange)' : '4px solid var(--text-secondary)',
                                    opacity: swapSourceIndex === realIndex ? 1 : 0.8
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-secondary)', width: '24px', fontSize: '0.8rem' }}>{realIndex + 1}</span>
                                    <div className="jersey-number" style={{ fontSize: '1.2rem', marginRight: '1rem' }}>{player.number}</div>
                                    <div className="player-name" style={{ flex: 1 }}>{player.firstName}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                className="btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
                onClick={() => onStartGame(orderedPlayers)}
            >
                Tip Off! 🏀
            </button>
        </div>
    );
}
