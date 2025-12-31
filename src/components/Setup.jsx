import { useState } from 'react';
import { getAvatarUrl } from '../utils/avatar';

export function Setup({ players, addPlayer, removePlayer, updatePlayerAvatar }) {
    const [name, setName] = useState('');
    const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(null);
    const [editPlayerId, setEditPlayerId] = useState(null); // ID of player being edited

    // 13 Boys and 7 Girls Options
    const BOY_SEEDS = Array.from({ length: 13 }, (_, i) => `boy-${i + 1}`);
    const GIRL_SEEDS = Array.from({ length: 7 }, (_, i) => `girl-${i + 1}`);
    const ALL_SEEDS = [...GIRL_SEEDS, ...BOY_SEEDS]; // Girls first or mixed? Let's do Girls first then Boys or vice versa.
    // Actually typically alternating is nice, but user asked specifically for counts. Let's group them or mix validly.
    // Let's just list them.


    const handleSubmit = (e) => {
        e.preventDefault();

        if (editPlayerId) {
            if (selectedAvatarSeed) {
                updatePlayerAvatar(editPlayerId, selectedAvatarSeed);
            }
            setEditPlayerId(null);
            setName('');
            setSelectedAvatarSeed(null);
        } else {
            if (name.trim()) {
                addPlayer(name.trim(), selectedAvatarSeed);
                setName('');
                setSelectedAvatarSeed(null);
            }
        }
    };

    const startEditing = (player) => {
        setEditPlayerId(player.id);
        setName(player.name);
        setSelectedAvatarSeed(player.avatarSeed);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditPlayerId(null);
        setName('');
        setSelectedAvatarSeed(null);
    }

    return (
        <div className="container animate-pop">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '3rem', color: '#111827' }}>
                {editPlayerId ? 'Update Identity 🥸' : 'Add Contenders 🏃'}
            </h2>

            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '750px', margin: '0 auto' }}>

                {/* 1. Avatar Selection Grid */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#4b5563', fontSize: '1.2rem', fontWeight: 600 }}>
                        {editPlayerId ? '1. Pick New Avatar' : '1. Choose Avatar'}
                    </h3>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.8rem',
                        maxHeight: '250px', overflowY: 'auto', padding: '0.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '16px'
                    }}>
                        {ALL_SEEDS.map(seed => (
                            <div
                                key={seed}
                                onClick={() => setSelectedAvatarSeed(seed)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '5px',
                                    borderRadius: '12px',
                                    border: selectedAvatarSeed === seed ? '3px solid #ec4899' : '2px solid transparent',
                                    background: selectedAvatarSeed === seed ? 'rgba(236, 72, 153, 0.1)' : 'white',
                                    transition: 'all 0.2s',
                                    transform: selectedAvatarSeed === seed ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                <img
                                    src={getAvatarUrl(seed)}
                                    alt="avatar"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Name Input / Save Action */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexDirection: 'column' }}>
                    <h3 style={{ color: '#4b5563', fontSize: '1.2rem', fontWeight: 600 }}>
                        {editPlayerId ? '2. Confirm Update' : '2. Enter Name'}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '60px', height: '60px', background: '#f3f4f6', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                            {selectedAvatarSeed ? (
                                <img
                                    src={getAvatarUrl(selectedAvatarSeed)}
                                    alt="Selected"
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#d1d5db' }}>?</div>
                            )}
                        </div>
                        <input
                            type="text"
                            className="input-modern"
                            placeholder="Type player name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!!editPlayerId}
                            style={{ flex: 1, fontSize: '1.5rem', background: editPlayerId ? '#f3f4f6' : 'white', cursor: editPlayerId ? 'not-allowed' : 'text' }}
                        />
                        {editPlayerId ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" onClick={cancelEdit} className="btn" style={{ background: '#9ca3af', color: 'white', padding: '0 1.5rem' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn" style={{ background: '#10b981', color: 'white', padding: '0 2rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}>
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button type="submit" className="btn" style={{ background: '#ec4899', color: 'white', padding: '0 2.5rem', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)' }}>
                                Add +
                            </button>
                        )}

                    </div>
                </form>

                <div className="players-list">
                    <h3 style={{ marginBottom: '1.5rem', color: '#4b5563', fontSize: '1.2rem', fontWeight: 600 }}>
                        Roster ({players.length})
                    </h3>

                    {players.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e5e7eb' }}>
                            <p style={{ opacity: 0.7, fontSize: '1.2rem', color: '#6b7280' }}>No players added yet.</p>
                            <p style={{ opacity: 0.5, color: '#9ca3af' }}>Select an avatar & name to start!</p>
                        </div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                            {players.map(player => (
                                <li key={player.id}
                                    style={{
                                        padding: '1rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: editPlayerId === player.id ? '#ecfdf5' : 'white',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                        border: editPlayerId === player.id ? '2px solid #10b981' : '1px solid #f3f4f6',
                                        opacity: (editPlayerId && editPlayerId !== player.id) ? 0.5 : 1
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', background: '#e0f2fe', borderRadius: '12px', overflow: 'hidden', border: '2px solid #bfdbfe', cursor: 'pointer' }} onClick={() => startEditing(player)}>
                                            <img
                                                src={getAvatarUrl(player.avatarSeed)}
                                                alt={player.name}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </div>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937' }}>{player.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => startEditing(player)}
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}
                                            title="Edit Avatar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => removePlayer(player.id)}
                                            className="btn"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#ef4444', background: '#fee2e2', border: 'none', boxShadow: 'none' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
