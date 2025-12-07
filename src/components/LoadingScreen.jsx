import React from 'react';

export function LoadingScreen() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div className="bouncing-ball"></div>
            <h2 style={{ marginTop: '2rem', color: 'var(--accent-orange)' }}>CoachCorner</h2>

            <style>{`
                .bouncing-ball {
                    width: 60px;
                    height: 60px;
                    background-color: var(--accent-orange);
                    border-radius: 50%;
                    background-image: radial-gradient(circle at 15px 15px, #fba158, #ea580c);
                    position: relative;
                    animation: bounce 1s infinite ease-in-out alternate;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }

                @keyframes bounce {
                    0% { transform: translateY(-50px); }
                    100% { transform: translateY(0); }
                }
                
                /* Add faint lines to make it look like a basketball */
                .bouncing-ball::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 2px solid rgba(0,0,0,0.1);
                    border-radius: 50%;
                    border-left-color: transparent;
                    border-right-color: transparent;
                    transform: rotate(45deg);
                }
            `}</style>
        </div>
    );
}
