import React from 'react';
import { useGame } from '../contexts/GameContext';

export function GameSummary() {
    const { gameState, resetGame } = useGame();
    const { score, playerStats, activePlayers, benchPlayers } = gameState;

    // Combine all players for the chart
    const allPlayers = [...activePlayers, ...benchPlayers].sort((a, b) => {
        // Sort by number for the summary view
        return parseInt(a.number) - parseInt(b.number);
    });

    // Helper to calculate points by quarter for a player
    const getPlayerQuarterStats = (playerId) => {
        const stats = { q1: 0, q2: 0, q3: 0, q4: 0, total: 0 };

        gameState.scoringEvents.forEach(event => {
            if (event.playerId === playerId) {
                stats.total += event.points;
                const quarter = Math.floor(event.period / 2) + 1; // 0,1->Q1, 2,3->Q2...
                if (quarter === 1) stats.q1 += event.points;
                if (quarter === 2) stats.q2 += event.points;
                if (quarter === 3) stats.q3 += event.points;
                if (quarter === 4) stats.q4 += event.points;
            }
        });
        return stats;
    };

    const handleShare = async () => {
        const date = new Date().toLocaleDateString();
        let summary = `🏀 CoachCorner Game Summary - ${date}\n`;
        summary += `Final Score: Team ${score.team} - ${score.opponent} Opponent\n\n`;
        summary += `Player Stats:\n`;
        summary += `No. Name        Q1  Q2  Q3  Q4  Tot\n`;
        summary += `-----------------------------------\n`;

        allPlayers.forEach(player => {
            const stats = getPlayerQuarterStats(player.id);
            if (stats.total > 0 || playerStats[player.id]?.periodsPlayed > 0) {
                // Formatting for simple text alignment (approximate)
                const num = (`#${player.number}`).padEnd(4);
                const name = player.firstName.slice(0, 10).padEnd(11);
                const q1 = stats.q1.toString().padStart(3);
                const q2 = stats.q2.toString().padStart(3);
                const q3 = stats.q3.toString().padStart(3);
                const q4 = stats.q4.toString().padStart(3);
                const tot = stats.total.toString().padStart(4);

                summary += `${num} ${name} ${q1} ${q2} ${q3} ${q4} ${tot}\n`;
            }
        });

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'CoachCorner Game Summary',
                    text: summary
                });
            } else {
                await navigator.clipboard.writeText(summary);
                alert('Game summary copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
            await navigator.clipboard.writeText(summary);
            alert('Game summary copied to clipboard!');
        }
    };

    const handleExportCSV = () => {
        const date = new Date().toLocaleDateString();
        let csv = `Date,${date}\n`;
        csv += `Team Score,${score.team}\n`;
        csv += `Opponent Score,${score.opponent}\n\n`;
        csv += `Number,Name,Q1,Q2,Q3,Q4,Total Points\n`;

        allPlayers.forEach(player => {
            const stats = getPlayerQuarterStats(player.id);
            csv += `${player.number},${player.firstName} ${player.lastName || ''},${stats.q1},${stats.q2},${stats.q3},${stats.q4},${stats.total}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `game_summary_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="card" style={{ padding: '1rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Game Report</h2>

            {/* Score Board */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '2rem',
                backgroundColor: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TEAM</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{score.team}</div>
                </div>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>-</div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OPP</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{score.opponent}</div>
                </div>
            </div>

            {/* Stats Table - Portrait Optimized */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Player Stats (By Quarter)</h3>
                <div style={{
                    overflowX: 'auto',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Player</th>
                                <th style={{ padding: '0.5rem', width: '30px' }}>Q1</th>
                                <th style={{ padding: '0.5rem', width: '30px' }}>Q2</th>
                                <th style={{ padding: '0.5rem', width: '30px' }}>Q3</th>
                                <th style={{ padding: '0.5rem', width: '30px' }}>Q4</th>
                                <th style={{ padding: '0.5rem', width: '40px', fontWeight: 'bold' }}>Tot</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPlayers.map((player, idx) => {
                                const stats = getPlayerQuarterStats(player.id);
                                const isAlternate = idx % 2 === 1;
                                return (
                                    <tr key={player.id} style={{
                                        backgroundColor: isAlternate ? 'rgba(255,255,255,0.03)' : 'transparent',
                                        borderTop: '1px solid var(--border-color)'
                                    }}>
                                        <td style={{ padding: '0.5rem', textAlign: 'left' }}>
                                            <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold', marginRight: '4px' }}>
                                                #{player.number}
                                            </span>
                                            {player.firstName}
                                        </td>
                                        <td style={{ padding: '0.5rem', textAlign: 'center', color: stats.q1 > 0 ? 'white' : 'var(--text-secondary)' }}>
                                            {stats.q1 || '-'}
                                        </td>
                                        <td style={{ padding: '0.5rem', textAlign: 'center', color: stats.q2 > 0 ? 'white' : 'var(--text-secondary)' }}>
                                            {stats.q2 || '-'}
                                        </td>
                                        <td style={{ padding: '0.5rem', textAlign: 'center', color: stats.q3 > 0 ? 'white' : 'var(--text-secondary)' }}>
                                            {stats.q3 || '-'}
                                        </td>
                                        <td style={{ padding: '0.5rem', textAlign: 'center', color: stats.q4 > 0 ? 'white' : 'var(--text-secondary)' }}>
                                            {stats.q4 || '-'}
                                        </td>
                                        <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                                            {stats.total}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gap: '0.75rem' }}>
                <button
                    className="btn-primary"
                    onClick={handleShare}
                    style={{ width: '100%', padding: '0.75rem' }}
                >
                    Share Text Summary 📱
                </button>
                <button
                    className="btn-secondary"
                    onClick={handleExportCSV}
                    style={{ width: '100%', padding: '0.75rem' }}
                >
                    Export CSV 📊
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => {
                        if (window.confirm('Start a new game? Current data will be lost.')) {
                            resetGame();
                        }
                    }}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: '1rem',
                        border: '1px solid var(--danger)',
                        color: 'var(--danger)'
                    }}
                >
                    Start New Game 🔄
                </button>
            </div>
        </div>
    );
}
