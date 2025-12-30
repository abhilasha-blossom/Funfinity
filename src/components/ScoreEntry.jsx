import React, { useState, useEffect } from 'react';

export function ScoreEntry({ game, players, updateScore, onBack }) {
    const [localScores, setLocalScores] = useState({});

    useEffect(() => {
        const initial = {};
        players.forEach(p => {
            initial[p.id] = p.scores[game.id] || '';
        });
        setLocalScores(initial);
    }, [game.id, players]);

    const handleScoreChange = (playerId, value) => {
        if (value === '' || !isNaN(value)) {
            setLocalScores(prev => ({ ...prev, [playerId]: value }));
        }
    };

    const handleSave = () => {
        players.forEach(p => {
            const val = localScores[p.id];
            const numVal = val === '' ? null : Number(val);
            updateScore(p.id, game.id, numVal);
        });
        onBack();
    };

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                <button onClick={onBack} className="btn btn-secondary" style={{ marginRight: '2rem' }}>
                    &lt; BACK
                </button>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-yellow)', marginBottom: '0.5rem' }}>{game.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '1.1rem' }}>{game.description}</p>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div className="score-grid" style={{ display: 'grid', gap: '1rem' }}>
                    {players.length === 0 ? (
                        <p style={{ fontFamily: 'var(--font-retro)' }}>NO PLAYERS DETECTED.</p>
                    ) : (
                        players.map((player, i) => (
                            <div key={player.id}
                                style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(0,0,0,0.6)',
                                    border: '1px solid var(--accent-cyan)',
                                }}
                            >
                                <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)', fontWeight: 'bold' }}>
                                    PLAYER {i + 1}: <span style={{ color: 'var(--accent-pink)' }}>{player.name}</span>
                                </span>
                                <input
                                    type="number"
                                    className="glass-input"
                                    style={{ width: '120px', textAlign: 'center', fontFamily: 'var(--font-retro)', fontSize: '1rem', padding: '0.5rem' }}
                                    placeholder="000"
                                    value={localScores[player.id] !== undefined ? localScores[player.id] : ''}
                                    onChange={(e) => handleScoreChange(player.id, e.target.value)}
                                />
                            </div>
                        ))
                    )}
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'right', borderTop: '2px solid var(--accent-cyan)', paddingTop: '2rem' }}>
                    <button className="btn" onClick={handleSave} style={{ fontSize: '1rem' }}>
                        CONFIRM SCORES
                    </button>
                </div>
            </div>
        </div>
    );
}
