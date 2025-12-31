import React from 'react';
import { getAvatarUrl } from '../utils/avatar';

// Gaming Rank Row
const RankRow = ({ player, rank, totalScore }) => {
    const isTop3 = rank <= 3;

    let rankColor = '#b2bec3';
    let badgeIcon = null;

    if (rank === 1) { rankColor = '#f1c40f'; badgeIcon = '👑'; }
    if (rank === 2) { rankColor = '#b2bec3'; badgeIcon = '🥈'; }
    if (rank === 3) { rankColor = '#e67e22'; badgeIcon = '🥉'; }

    return (
        <div
            style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 100px', alignItems: 'center',
                padding: '1rem 1.5rem', marginBottom: '0.8rem',
                background: isTop3 ? `linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))` : 'rgba(255,255,255,0.3)',
                borderRadius: '16px',
                border: isTop3 ? `1px solid ${rankColor}` : '1px solid rgba(255,255,255,0.5)',
                boxShadow: isTop3 ? `0 4px 15px ${rankColor}33` : 'none',
                transform: isTop3 ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.2s'
            }}
        >
            {/* Rank Badge */}
            <div style={{
                fontSize: '1.2rem', fontWeight: 900, color: rankColor,
                display: 'flex', alignItems: 'center', gap: '5px'
            }}>
                {rank} {badgeIcon}
            </div>

            {/* Player Info with Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                    src={getAvatarUrl(player.avatarSeed)}
                    alt="avatar"
                    style={{
                        width: '50px', height: '50px', borderRadius: '12px',
                        border: isTop3 ? `2px solid ${rankColor}` : '2px solid transparent',
                        background: 'rgba(255,255,255,0.5)'
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2d3436' }}>{player.name}</span>
                    <div style={{ height: '4px', width: '100%', minWidth: '100px', maxWidth: '200px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(totalScore, 100)}%`, background: rankColor, borderRadius: '4px' }}></div>
                    </div>
                </div>
            </div>

            {/* Score */}
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: isTop3 ? rankColor : '#636e72' }}>
                    {totalScore}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#b2bec3', display: 'block', fontWeight: 600 }}>XP</span>
            </div>
        </div>
    );
};

export function Leaderboard({ players, games, onReset, onShowPodium }) {
    const calculateTotalScore = (player) => {
        return Object.values(player.scores).reduce((acc, curr) => {
            return acc + (Number(curr) || 0);
        }, 0);
    };

    const sortedPlayers = [...players].sort((a, b) => calculateTotalScore(b) - calculateTotalScore(a));

    return (
        <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Header Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px', padding: '0 1.5rem', marginBottom: '1rem', color: '#b2bec3', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                <div>Rank</div>
                <div>Player</div>
                <div style={{ textAlign: 'right' }}>Score</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {sortedPlayers.map((player, index) => (
                    <RankRow
                        key={player.id}
                        player={player}
                        rank={index + 1}
                        totalScore={calculateTotalScore(player)}
                    />
                ))}

                {sortedPlayers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#b2bec3', fontStyle: 'italic' }}>
                        No players registered yet.
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>

                <button
                    onClick={onShowPodium}
                    className="glass-btn"
                    style={{
                        background: 'linear-gradient(135deg, #f1c40f, #f39c12)',
                        color: 'white', border: 'none',
                        fontSize: '1.2rem', padding: '1rem 2.5rem',
                        boxShadow: '0 10px 20px rgba(243, 156, 18, 0.4)'
                    }}
                >
                    🏆 Start Victory Ceremony
                </button>

                <button
                    onClick={onReset}
                    className="glass-btn-ghost"
                    style={{ fontSize: '0.9rem', color: '#b2bec3', fontWeight: 600 }}
                >
                    🔄 Reset Tournament Scores
                </button>
            </div>
        </div>
    );
}
