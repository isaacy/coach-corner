import React, { useRef } from 'react';
import { ROTATIONS } from '../logic/rotationPatterns';

export function RotationView({ roster, onBack }) {
  const playerCount = roster.length;
  const rotationData = ROTATIONS[playerCount];
  const scrollContainerRef = useRef(null);

  if (!rotationData) {
    return (
      <div className="card">
        <h2>Rotation Not Available</h2>
        <p>No rotation pattern found for {playerCount} players. Please select between 6 and 12 players.</p>
        <button className="btn-secondary" onClick={onBack}>Back</button>
      </div>
    );
  }

  const { periods, matrix } = rotationData;

  // Calculate stats
  const playerStats = roster.map((player, index) => {
    const row = matrix[index] || [];
    const periodsPlayed = row.filter(val => val === 1).length;
    return { ...player, periodsPlayed };
  });

  const [showChart, setShowChart] = React.useState(false);

  const scrollToPeriod = (index) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'transparent', border: 'none', boxShadow: 'none' }}>
      <div className="flex-between" style={{ marginBottom: '1rem', padding: '0 1rem' }}>
        <h2>Game Plan</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              <div key={i} style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>P{i + 1}</div>
            ))}
            <div style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>Tot</div>

            {roster.map((player, rowIndex) => (
              <React.Fragment key={player.id}>
                <div style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)' }}>
                  <span style={{ color: 'var(--accent-orange)', marginRight: '0.25rem' }}>#{player.number}</span> {player.firstName}
                </div>
                {Array.from({ length: periods }).map((_, colIndex) => {
                  const isPlaying = matrix[rowIndex] && matrix[rowIndex][colIndex] === 1;
                  return (
                    <div key={colIndex} style={{
                      backgroundColor: isPlaying ? 'var(--success)' : 'var(--bg-primary)',
                      opacity: isPlaying ? 0.8 : 0.2
                    }} />
                  );
                })}
                <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem', backgroundColor: 'var(--bg-primary)' }}>
                  {playerStats[rowIndex].periodsPlayed}
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
          scrollbarWidth: 'none', // Hide scrollbar Firefox
          msOverflowStyle: 'none' // Hide scrollbar IE
        }}
      >
        {Array.from({ length: periods }).map((_, periodIndex) => {
          const quarter = Math.floor(periodIndex / 2) + 1;
          const session = (periodIndex % 2) + 1;

          // Get players ON and OFF for this period
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

      {/* Pagination Dots */}
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
