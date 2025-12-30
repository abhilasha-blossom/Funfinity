import React, { useState } from 'react';

export function Setup({ players, addPlayer, removePlayer }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            addPlayer(name.trim());
            setName('');
        }
    };

    return (
        <div className="container animate-pop">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '3rem', color: '#111827' }}>
                Add Contenders 🏃
            </h2>

            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '700px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <input
                        type="text"
                        className="input-modern"
                        placeholder="Type player name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        style={{ flex: 1, fontSize: '1.5rem', background: 'white' }}
                    />
                    <button type="submit" className="btn" style={{ background: '#ec4899', color: 'white', padding: '0 2.5rem', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)' }}>
                        Add +
                    </button>
                </form>

                <div className="players-list">
                    <h3 style={{ marginBottom: '1.5rem', color: '#4b5563', fontSize: '1.2rem', fontWeight: 600 }}>
                        Roster ({players.length})
                    </h3>

                    {players.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e5e7eb' }}>
                            <p style={{ opacity: 0.7, fontSize: '1.2rem', color: '#6b7280' }}>No players added yet.</p>
                            <p style={{ opacity: 0.5, color: '#9ca3af' }}>Type a name above to get started!</p>
                        </div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                            {players.map(player => (
                                <li key={player.id}
                                    style={{
                                        padding: '1.5rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'white',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937' }}>{player.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removePlayer(player.id)}
                                        className="btn"
                                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', color: '#ef4444', background: '#fee2e2', border: 'none', boxShadow: 'none' }}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
