import React, { useRef, useState } from 'react';
import { ROTATIONS } from '../logic/rotationPatterns';
import { useGame } from '../contexts/GameContext';
import { ScoreTracker } from './ScoreTracker';
import { GameSummary } from './GameSummary';

export function RotationView({ roster, onBack }) {
  const playerCount = roster.length;
  const rotationData = ROTATIONS[playerCount];
  const scrollContainerRef = useRef(null);
  const { gameState, startGame, swapPlayer, nextPeriod, endGame } = useGame();

  const [showChart, setShowChart] = useState(false);
  const [swapMode, setSwapMode] = useState(null);

  if (gameState.isGameOver) {
    return <GameSummary />;
  }

  if (!rotationData) {
    return (
      <div className="card">
        <h2>Rotation Not Available</h2>
        <p>No rotation pattern found for {playerCount} players. Please select between 5 and 12 players.</p>
        <button className="btn-secondary" onClick={onBack}>Back</button>
      </div>
    );
  }

  const { periods, matrix } = rotationData;

  const playerStats = roster.map((player, index) => {
    const row = matrix[index] || [];
    const periodsPlayed = row.filter(val => val === 1).length;
    return { ...player, periodsPlayed };
  });

  const scrollToPeriod = (index) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
    }
  };

  const handleStartLive = () => {
    startGame(roster, matrix);
  };

  const handleSwap = (courtPlayerId) => {
    if (swapMode && swapMode.courtPlayerId === courtPlayerId) {
      setSwapMode(null);
    } else {
      setSwapMode({ courtPlayerId });
    }
  };

  const handleSelectBench = (benchPlayerId) => {
    if (swapMode) {
      swapPlayer(swapMode.courtPlayerId, benchPlayerId);
      setSwapMode(null);
    }
  };

  const handleNextPeriod = () => {
    nextPeriod();
    if (scrollContainerRef.current) {
      scrollToPeriod(gameState.currentPeriod + 1);
    }
  };

  const handleEndGame = () => {
    if (window.confirm('End the game? You can view the final stats.')) {
      endGame();
    }
  };

  // Live Mode View
  if (gameState.isLive) {
    const quarter = Math.floor(gameState.currentPeriod / 2) + 1;
    const session = (gameState.currentPeriod % 2) + 1;

    return (
      <div className="card" style={{ padding: '1rem' }}>
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h2>Live Game</h2>
          <button className="btn-secondary" onClick={handleEndGame} style={{ fontSize: '0.8rem' }}>
            End Game
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Quarter {quarter} • Session {session}
          </div>
          <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-orange)' }}>
            Period {gameState.currentPeriod + 1}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            className="btn-secondary"
            onClick={() => setShowChart(!showChart)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            {showChart ? 'Hide Chart' : 'Show Full Chart'}
          </button>
        </div>

        {showChart && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            margin: '0 0 1rem 0',
            borderRadius: 'var(--radius-md)',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `120px repeat(${periods}, 1fr) 50px`,
              gap: '1px',
              minWidth: '600px'
            }}>
              <div style={{ padding: '0.5rem', fontWeight: 'bold', fontSize: '0.8rem' }}>Player</div>
              {Array.from({ length: periods }).map((_, i) => (
                <div key={i} style={{
                  padding: '0.5rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  backgroundColor: gameState.isLive && i === gameState.currentPeriod ? 'rgba(245, 132, 38, 0.2)' : 'transparent',
                  borderBottom: gameState.isLive && i === gameState.currentPeriod ? '2px solid var(--accent-orange)' : 'none'
                }}>P{i + 1}</div>
              ))}
              <div style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>Tot</div>

              {roster.map((player, rowIndex) => (
                <React.Fragment key={player.id}>
                  <div style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)' }}>
                    <span style={{ color: 'var(--accent-orange)', marginRight: '0.25rem' }}>#{player.number}</span> {player.firstName}
                  </div>
                  {Array.from({ length: periods }).map((_, colIndex) => {
                    // Determine cell style and content based on game state
                    let backgroundColor = 'var(--bg-primary)';
                    let opacity = 0.2;
                    let content = null;

                    if (gameState.isLive) {
                      const isCurrentPeriod = colIndex === gameState.currentPeriod;
                      const isPastPeriod = colIndex < gameState.currentPeriod;
                      const isFuturePeriod = colIndex > gameState.currentPeriod;

                      // Calculate points for this period
                      const pointsInPeriod = gameState.scoringEvents
                        .filter(e => e.period === colIndex && e.playerId === player.id)
                        .reduce((sum, e) => sum + e.points, 0);

                      if (pointsInPeriod > 0) {
                        content = <span style={{ fontWeight: 'bold', color: 'white' }}>{pointsInPeriod}</span>;
                      }

                      if (isCurrentPeriod) {
                        const isActive = gameState.activePlayers.some(p => p.id === player.id);
                        const hasPlayed = gameState.actualParticipation[colIndex]?.includes(player.id);

                        if (isActive) {
                          backgroundColor = '#F59E0B'; // Currently playing -> Yellow/Amber
                          opacity = 0.9;
                        } else if (hasPlayed) {
                          backgroundColor = '#EA580C'; // Subbed out -> Orange
                          opacity = 0.7;
                        }
                      } else if (isPastPeriod) {
                        const playedInPast = gameState.actualParticipation[colIndex]?.includes(player.id);
                        if (playedInPast) {
                          backgroundColor = '#EA580C'; // Played in past -> Orange
                          opacity = 0.7;
                        }
                      } else if (isFuturePeriod) {
                        // Show planned rotation
                        const isPlanned = matrix[rowIndex] && matrix[rowIndex][colIndex] === 1;
                        if (isPlanned) {
                          backgroundColor = 'var(--success)';
                          opacity = 0.3;
                        }
                      }
                    }

                    return (
                      <div key={colIndex} style={{
                        backgroundColor,
                        opacity,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem'
                      }}>
                        {content}
                      </div>
                    );
                  })}
                  <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem', backgroundColor: 'var(--bg-primary)' }}>
                    {gameState.isLive && gameState.playerStats[player.id]
                      ? gameState.playerStats[player.id].points
                      : playerStats[rowIndex].periodsPlayed}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <ScoreTracker />

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>🏀 ON COURT</h3>
          {swapMode && (
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>
              Tap a bench player to swap
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {gameState.activePlayers.map(player => (
              <div
                key={player.id}
                onClick={() => handleSwap(player.id)}
                className="player-card"
                style={{
                  borderLeft: swapMode?.courtPlayerId === player.id ? '4px solid var(--accent-orange)' : '4px solid var(--success)',
                  cursor: 'pointer',
                  backgroundColor: swapMode?.courtPlayerId === player.id ? 'rgba(245, 132, 38, 0.1)' : 'var(--bg-secondary)'
                }}
              >
                <div className="jersey-number">{player.number}</div>
                <div className="player-name">{player.firstName}</div>
                {gameState.playerStats[player.id] && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {gameState.playerStats[player.id].points}pts
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>🪑 BENCH</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {gameState.benchPlayers.map(player => (
              <div
                key={player.id}
                onClick={() => swapMode && handleSelectBench(player.id)}
                style={{
                  backgroundColor: swapMode ? 'var(--bg-secondary)' : 'rgba(0,0,0,0.2)',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: swapMode ? 1 : 0.7,
                  cursor: swapMode ? 'pointer' : 'default',
                  border: swapMode ? '2px solid var(--accent-orange)' : 'none'
                }}
              >
                <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{player.number}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{player.firstName}</span>
              </div>
            ))}
          </div>
        </div>

        {gameState.currentPeriod < 7 && (
          <button
            className="btn-primary"
            onClick={handleNextPeriod}
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
          >
            Next Period →
          </button>
        )}
      </div>
    );
  }

  // Planning Mode View
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'transparent', border: 'none', boxShadow: 'none' }}>
      <div className="flex-between" style={{ marginBottom: '1rem', padding: '0 1rem' }}>
        <h2>Game Plan</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-primary"
            onClick={handleStartLive}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            Start Live
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowChart(!showChart)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            {showChart ? 'Hide Chart' : 'Full Chart'}
          </button>
          <button className="btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Edit Roster</button>
        </div>
      </div>

      {showChart && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          margin: '0 1rem 1rem 1rem',
          borderRadius: 'var(--radius-md)',
          overflowX: 'auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `120px repeat(${periods}, 1fr) 50px`,
            gap: '1px',
            minWidth: '600px'
          }}>
            <div style={{ padding: '0.5rem', fontWeight: 'bold', fontSize: '0.8rem' }}>Player</div>
            {Array.from({ length: periods }).map((_, i) => (
              <div key={i} style={{
                padding: '0.5rem',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                backgroundColor: gameState.isLive && i === gameState.currentPeriod ? 'rgba(245, 132, 38, 0.2)' : 'transparent',
                borderBottom: gameState.isLive && i === gameState.currentPeriod ? '2px solid var(--accent-orange)' : 'none'
              }}>P{i + 1}</div>
            ))}
            <div style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>Tot</div>

            {roster.map((player, rowIndex) => (
              <React.Fragment key={player.id}>
                <div style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)' }}>
                  <span style={{ color: 'var(--accent-orange)', marginRight: '0.25rem' }}>#{player.number}</span> {player.firstName}
                </div>
                {Array.from({ length: periods }).map((_, colIndex) => {
                  // Determine cell style and content based on game state
                  let backgroundColor = 'var(--bg-primary)';
                  let opacity = 0.2;
                  let content = null;

                  if (gameState.isLive) {
                    const isCurrentPeriod = colIndex === gameState.currentPeriod;
                    const isPastPeriod = colIndex < gameState.currentPeriod;
                    const isFuturePeriod = colIndex > gameState.currentPeriod;

                    // Calculate points for this period
                    const pointsInPeriod = gameState.scoringEvents
                      .filter(e => e.period === colIndex && e.playerId === player.id)
                      .reduce((sum, e) => sum + e.points, 0);

                    if (pointsInPeriod > 0) {
                      content = <span style={{ fontWeight: 'bold', color: 'white' }}>{pointsInPeriod}</span>;
                    }

                    if (isCurrentPeriod) {
                      const isActive = gameState.activePlayers.some(p => p.id === player.id);
                      const hasPlayed = gameState.actualParticipation[colIndex]?.includes(player.id);

                      if (isActive) {
                        backgroundColor = 'var(--accent-orange)'; // Currently playing -> Orange
                        opacity = 0.8;
                      } else if (hasPlayed) {
                        backgroundColor = 'var(--danger)'; // Subbed out -> Red
                        opacity = 0.6;
                      }
                    } else if (isPastPeriod) {
                      const playedInPast = gameState.actualParticipation[colIndex]?.includes(player.id);
                      if (playedInPast) {
                        backgroundColor = 'var(--danger)'; // Played in past -> Red
                        opacity = 0.6;
                      }
                    } else if (isFuturePeriod) {
                      // Show planned rotation
                      const isPlanned = matrix[rowIndex] && matrix[rowIndex][colIndex] === 1;
                      if (isPlanned) {
                        backgroundColor = 'var(--success)';
                        opacity = 0.3;
                      }
                    }
                  } else {
                    // Planning mode (original logic)
                    const isPlaying = matrix[rowIndex] && matrix[rowIndex][colIndex] === 1;
                    if (isPlaying) {
                      backgroundColor = 'var(--success)';
                      opacity = 0.8;
                    }
                  }

                  return (
                    <div key={colIndex} style={{
                      backgroundColor,
                      opacity,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem'
                    }}>
                      {content}
                    </div>
                  );
                })}
                <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem', backgroundColor: 'var(--bg-primary)' }}>
                  {gameState.isLive && gameState.playerStats[player.id]
                    ? gameState.playerStats[player.id].points
                    : playerStats[rowIndex].periodsPlayed}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '1rem',
          padding: '0 1rem 2rem 1rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {Array.from({ length: periods }).map((_, periodIndex) => {
          const quarter = Math.floor(periodIndex / 2) + 1;
          const session = (periodIndex % 2) + 1;

          const playersOn = [];
          const playersOff = [];

          roster.forEach((player, playerIndex) => {
            const isPlaying = matrix[playerIndex] && matrix[playerIndex][periodIndex] === 1;
            if (isPlaying) {
              playersOn.push(player);
            } else {
              playersOff.push(player);
            }
          });

          return (
            <div
              key={periodIndex}
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'center',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxSizing: 'border-box',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Quarter {quarter} • Session {session}
                </div>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-orange)' }}>
                  Period {periodIndex + 1}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'var(--success)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🏀</span> ON COURT
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                  {playersOn.map(player => (
                    <div key={player.id} className="player-card" style={{ borderLeft: '4px solid var(--success)', marginBottom: 0 }}>
                      <div className="jersey-number">{player.number}</div>
                      <div className="player-name">{player.firstName}</div>
                    </div>
                  ))}
                </div>

                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🪑</span> BENCH
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {playersOff.map(player => (
                    <div key={player.id} style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: 0.7
                    }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{player.number}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{player.firstName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        {Array.from({ length: periods }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPeriod(i)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'var(--text-secondary)',
              opacity: 0.3,
              padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}
