import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export function Podium({ players, onBack }) {
    const calculateTotalScore = (player) => {
        return Object.values(player.scores).reduce((acc, curr) => {
            return acc + (Number(curr) || 0);
        }, 0);
    };

    // Sort and get Top 2
    const sortedPlayers = [...players].sort((a, b) => calculateTotalScore(b) - calculateTotalScore(a));
    const winner = sortedPlayers[0];
    const runnerUp = sortedPlayers[1];

    useEffect(() => {
        // Trigger confetti burst on load
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    if (!winner) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'linear-gradient(135deg, #1e272e, #000000)',
            zIndex: 2000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            fontFamily: "'Fredoka', sans-serif" // Assuming global font
        }}>
            <button
                onClick={onBack}
                style={{
                    position: 'absolute', top: '2rem', right: '2rem',
                    background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                    padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                    zIndex: 2001
                }}
            >
                Close Victory Screen
            </button>

            <h1 style={{
                fontSize: '6rem', marginBottom: '8rem',
                textShadow: '0 0 20px #f1c40f, 0 0 40px #e67e22',
                animation: 'pulse 2s infinite',
                marginTop: '-120px',
                position: 'relative', zIndex: 10
            }}>
                VICTORY!
            </h1>

            <div style={{
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4rem',
                marginTop: '2rem'
            }}>
                {/* Runner Up */}
                {runnerUp && (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        animation: 'slideUp 1s ease-out 0.5s backwards',
                        opacity: 0.8
                    }}>
                        <div style={{
                            width: '150px', height: '150px',
                            background: '#bdc3c7', borderRadius: '50%',
                            border: '5px solid #7f8c8d',
                            overflow: 'hidden', marginBottom: '1rem',
                            position: 'relative'
                        }}>
                            <img
                                src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${runnerUp.avatarSeed}&skinColor=f2d3b1,ffdfbf&hairColor=2c1b18,4a312c`}
                                alt="Runner Up"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{
                            background: '#7f8c8d', color: 'white', padding: '0.5rem 1.5rem',
                            borderRadius: '8px', fontWeight: 800, fontSize: '1.2rem'
                        }}>
                            #2 {runnerUp.name}
                        </div>
                        <div style={{ marginTop: '0.5rem', color: '#bdc3c7' }}>
                            {calculateTotalScore(runnerUp)} pts
                        </div>
                    </div>
                )}

                {/* WINNER */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    animation: 'slideUp 1s cubic-bezier(0.1, 0.7, 1.0, 0.1) backwards',
                    transform: 'scale(1.2) translateY(-30px)',
                    zIndex: 10
                }}>
                    <div style={{
                        fontSize: '3rem', position: 'absolute', top: '-60px',
                        animation: 'bounce 1s infinite'
                    }}>
                        👑
                    </div>
                    <div style={{
                        width: '200px', height: '200px',
                        background: '#f1c40f', borderRadius: '50%',
                        border: '8px solid #f39c12',
                        overflow: 'hidden', marginBottom: '1rem',
                        boxShadow: '0 0 50px rgba(241, 196, 15, 0.5)'
                    }}>
                        <img
                            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${winner.avatarSeed}&skinColor=f2d3b1,ffdfbf&hairColor=2c1b18,4a312c`}
                            alt="Winner"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div style={{
                        background: '#f39c12', color: 'white', padding: '0.8rem 2rem',
                        borderRadius: '12px', fontWeight: 900, fontSize: '1.8rem',
                        boxShadow: '0 5px 0 #d35400'
                    }}>
                        {winner.name}
                    </div>
                    <div style={{ marginTop: '0.5rem', color: '#f1c40f', fontWeight: 700, fontSize: '1.2rem' }}>
                        {calculateTotalScore(winner)} pts
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100vh); opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
