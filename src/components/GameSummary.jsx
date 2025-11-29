import React from 'react';
import { useGame } from '../contexts/GameContext';

export function GameSummary() {
    const { gameState, resetGame } = useGame();
    const { score, playerStats, actualParticipation, activePlayers, benchPlayers, plannedRotation } = gameState;

    // Combine all players for the chart
    const allPlayers = [...activePlayers, ...benchPlayers].sort((a, b) => {
        // Sort by number for the summary view
        return parseInt(a.number) - parseInt(b.number);
    });

    const periods = 8;

    const handleShare = async () => {
        const date = new Date().toLocaleDateString();
        let summary = `🏀 CoachCorner Game Summary - ${date}\n`;
        summary += `Score: Team ${score.team} - ${score.opponent} Opponent\n\n`;

        summary += `Player Stats:\n`;
        allPlayers.forEach(player => {
            const stats = playerStats[player.id];
            if (stats && stats.periodsPlayed > 0) {
                summary += `#${player.number} ${player.firstName}: ${stats.points}pts (${stats.actualPeriodsPlayed} periods)\n`;
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
            // Fallback
            await navigator.clipboard.writeText(summary);
            alert('Game summary copied to clipboard!');
        }
    };

    return (
        <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>Game Over</h2>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                marginBottom: '2rem',
                backgroundColor: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>TEAM</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{score.team}</div>
                </div>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>-</div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>OPPONENT</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{score.opponent}</div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '1rem' }}>Rotation Summary</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `100px repeat(${periods}, 1fr) 40px`,
                    gap: '1px',
                    minWidth: '500px',
                    fontSize: '0.8rem'
                }}>
                    <div style={{ fontWeight: 'bold', padding: '0.25rem' }}>Player</div>
                    {Array.from({ length: periods }).map((_, i) => (
                        <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', padding: '0.25rem' }}>{i + 1}</div>
                    ))}
                    <div style={{ textAlign: 'center', fontWeight: 'bold', padding: '0.25rem' }}>Pts</div>

                    {allPlayers.map(player => (
                        <React.Fragment key={player.id}>
                            <div style={{ padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: 'var(--accent-orange)', marginRight: '0.25rem' }}>#{player.number}</span> {player.firstName}
                            </div>
                            {Array.from({ length: periods }).map((_, colIndex) => {
                                const played = actualParticipation[colIndex]?.includes(player.id);

                                // Calculate points for this period
                                const pointsInPeriod = gameState.scoringEvents
                                    .filter(e => e.period === colIndex && e.playerId === player.id)
                                    .reduce((sum, e) => sum + e.points, 0);

                                let backgroundColor = 'var(--bg-primary)';
                                let opacity = 0.1;

                                if (played) {
                                    backgroundColor = '#EA580C'; // Orange (Subbed/Past)
                                    opacity = 0.8;
                                }

                                return (
                                    <div key={colIndex} style={{
                                        backgroundColor,
                                        opacity,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        {pointsInPeriod > 0 ? pointsInPeriod : ''}
                                    </div>
                                );
                            })}
                            <div style={{ textAlign: 'center', padding: '0.25rem' }}>
                                {playerStats[player.id]?.points || 0}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                <button
                    className="btn-primary"
                    onClick={handleShare}
                    style={{ width: '100%', padding: '1rem' }}
                >
                    Share Result 📤
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => {
                        if (window.confirm('Start a new game? Current data will be lost.')) {
                            resetGame();
                        }
                    }}
                    style={{ width: '100%', padding: '1rem' }}
                >
                    New Game 🔄
                </button>
            </div>
        </div>
    );
}
