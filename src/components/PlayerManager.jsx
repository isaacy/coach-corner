import React, { useState } from 'react';

export function PlayerManager({ players, onAddPlayer, onRemovePlayer, onEditPlayer }) {
    const [editingId, setEditingId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [number, setNumber] = useState('');

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
        <div className="card">
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
