import React, { useState } from 'react';

const FIRST_NAMES = ['James', 'Michael', 'Kobe', 'LeBron', 'Stephen', 'Kevin', 'Chris', 'Dwyane', 'Tim', 'Magic', 'Larry', 'Shaq'];

export function PlayerManager({ players, onAddPlayer, onRemovePlayer, onEditPlayer }) {
    const [editingId, setEditingId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [number, setNumber] = useState('');

    const generateTestPlayers = () => {
        const numPlayers = 8;
        const usedNumbers = new Set(players.map(p => parseInt(p.number)));

        for (let i = 0; i < numPlayers; i++) {
            let jerseyNum;
            do {
                jerseyNum = Math.floor(Math.random() * 99) + 1;
            } while (usedNumbers.has(jerseyNum));

            usedNumbers.add(jerseyNum);

            const player = {
                id: Date.now().toString() + i,
                firstName: FIRST_NAMES[i % FIRST_NAMES.length],
                lastName: '',
                number: jerseyNum
            };

            onAddPlayer(player);
        }
    };

    const startEdit = (player) => {
        setEditingId(player.id);
        setFirstName(player.firstName);
        setLastName(player.lastName);
        setNumber(player.number);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFirstName('');
        setLastName('');
        setNumber('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!firstName || !number) return;

        if (editingId) {
            onEditPlayer({
                id: editingId,
                firstName,
                lastName,
                number
            });
            cancelEdit();
        } else {
            onAddPlayer({
                id: Date.now().toString(),
                firstName,
                lastName,
                number
            });
            setFirstName('');
            setLastName('');
            setNumber('');
        }
    };

    return (
        <div className="card" style={{ position: 'relative' }}>
            {/* Invisible test button in top right */}
            <button
                onClick={generateTestPlayers}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '60px',
                    height: '60px',
                    opacity: 0.1, // Make slightly visible for debugging
                    cursor: 'pointer',
                    border: '2px dashed var(--accent-orange)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 100
                }}
                aria-label="Generate test players"
            />

            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2>{editingId ? 'Edit Player' : 'Add Player'}</h2>
                {editingId && <button onClick={cancelEdit} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Cancel</button>}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div className="grid-2">
                    <input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <input
                        placeholder="#"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        type="number"
                    />
                    <button type="submit" className="btn-primary">
                        {editingId ? 'Save Changes' : 'Add to Roster'}
                    </button>
                </div>
            </form>

            <h3 style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Team Roster ({players.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {players.map(player => (
                    <div key={player.id} className="player-card">
                        <div className="jersey-number">{player.number}</div>
                        <div className="player-name">{player.firstName} {player.lastName}</div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => startEdit(player)}
                                className="btn-icon"
                                style={{ color: 'var(--accent-orange)' }}
                            >
                                ✎
                            </button>
                            <button
                                onClick={() => onRemovePlayer(player.id)}
                                className="btn-icon"
                                style={{ color: 'var(--danger)' }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
                {players.length === 0 && <p className="text-sm">No players added yet. Add some above!</p>}
            </div>
        </div>
    );
}
