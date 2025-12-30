import React, { useState, useEffect, useRef } from 'react';

// Dramatic Team Draft Component
const TeamDraft = ({ players, onComplete }) => {
    const [redTeam, setRedTeam] = useState([]);
    const [blueTeam, setBlueTeam] = useState([]);
    const [unassigned, setUnassigned] = useState([]);
    const [currentName, setCurrentName] = useState("READY?");
    const [drafting, setDrafting] = useState(false);
    const [turn, setTurn] = useState('RED'); // RED or BLUE
    const [animationState, setAnimationState] = useState('IDLE'); // IDLE, SPINNING, REVEALED

    // Prepare the draft
    useEffect(() => {
        setUnassigned([...players].sort(() => 0.5 - Math.random()));
    }, [players]);

    const startDraft = () => {
        setDrafting(true);
        processNextPick();
    };

    const processNextPick = () => {
        setAnimationState('SPINNING');
    };

    // Spinning Effect
    useEffect(() => {
        let interval;
        if (animationState === 'SPINNING' && unassigned.length > 0) {
            let spinCount = 0;
            interval = setInterval(() => {
                const randomIdx = Math.floor(Math.random() * unassigned.length);
                setCurrentName(unassigned[randomIdx].name);
                spinCount++;

                // Stop spinning after 20 frames (approx 1s)
                if (spinCount > 20) {
                    clearInterval(interval);
                    finalizePick();
                }
            }, 50);
        } else if (animationState === 'SPINNING' && unassigned.length === 0) {
            setDrafting(false);
            setAnimationState('DONE');
            onComplete({ teamA: redTeam, teamB: blueTeam });
        }
        return () => clearInterval(interval);
    }, [animationState, unassigned]);

    const finalizePick = () => {
        // Pick the first one from the shuffled unassigned list
        const pickedPlayer = unassigned[0];
        setCurrentName(pickedPlayer.name);
        setAnimationState('REVEALED');

        // Wait a beat to show the winner, then move them
        setTimeout(() => {
            if (turn === 'RED') {
                setRedTeam(prev => [...prev, pickedPlayer]);
                setTurn('BLUE');
            } else {
                setBlueTeam(prev => [...prev, pickedPlayer]);
                setTurn('RED');
            }
            setUnassigned(prev => prev.slice(1)); // Remove from pool

            // Loop if players remain
            if (unassigned.length > 1) { // Check > 1 because we just removed one (effectively)
                processNextPick();
            } else {
                setAnimationState('DONE');
                // One frame delay to let UI render final state
                setTimeout(() => onComplete({
                    teamA: turn === 'RED' ? [...redTeam, pickedPlayer] : redTeam,
                    teamB: turn === 'BLUE' ? [...blueTeam, pickedPlayer] : blueTeam
                }), 1000);
            }
        }, 800);
    };

    if (animationState === 'DONE') return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.9)', zIndex: 1000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: "'Outfit', sans-serif"
        }}>
            {/* Split Backgrounds */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(135deg, #d63031 0%, #ff7675 100%)', opacity: 0.2 }}></div>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)', opacity: 0.2 }}></div>

            {/* Teams Display */}
            <div style={{ position: 'absolute', top: '10%', padding: '0 5%', width: '100%', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
                <div style={{ width: '40%' }}>
                    <h2 style={{ color: '#ff7675', fontSize: '2rem', borderBottom: '2px solid #ff7675', paddingBottom: '0.5rem' }}>TEAM RED</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                        {redTeam.map(p => (
                            <span key={p.id} style={{ background: '#d63031', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 700, animation: 'pop 0.3s' }}>{p.name}</span>
                        ))}
                    </div>
                </div>
                <div style={{ width: '40%', textAlign: 'right' }}>
                    <h2 style={{ color: '#74b9ff', fontSize: '2rem', borderBottom: '2px solid #74b9ff', paddingBottom: '0.5rem' }}>TEAM BLUE</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                        {blueTeam.map(p => (
                            <span key={p.id} style={{ background: '#0984e3', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 700, animation: 'pop 0.3s' }}>{p.name}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Central Spinner */}
            <div style={{ zIndex: 20, textAlign: 'center' }}>
                {!drafting ? (
                    <button
                        onClick={startDraft}
                        style={{
                            fontSize: '2rem', padding: '1.5rem 4rem', borderRadius: '50px',
                            background: 'white', color: '#2d3436', border: 'none', fontWeight: 900,
                            cursor: 'pointer', boxShadow: '0 0 50px rgba(255,255,255,0.5)',
                            animation: 'pulse 1s infinite'
                        }}
                    >
                        START TEAM DRAFT
                    </button>
                ) : (
                    <div style={{ transform: 'scale(1.5)' }}>
                        <div style={{ fontSize: '1.5rem', color: '#b2bec3', letterSpacing: '5px', marginBottom: '1rem' }}>RECRUITING FOR</div>
                        <div style={{
                            fontSize: '3rem', fontWeight: 900,
                            color: turn === 'RED' ? '#ff7675' : '#74b9ff',
                            marginBottom: '2rem'
                        }}>
                            {turn} TEAM
                        </div>

                        <div style={{
                            fontSize: '5rem', fontWeight: 900,
                            background: 'rgba(255,255,255,0.1)', padding: '2rem 4rem', borderRadius: '20px',
                            border: `4px solid ${animationState === 'REVEALED' ? (turn === 'RED' ? '#ff7675' : '#74b9ff') : 'rgba(255,255,255,0.5)'}`,
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            minWidth: '400px',
                            transform: animationState === 'REVEALED' ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.2s',
                            color: 'white'
                        }}>
                            {currentName}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
                @keyframes pop { 0% { opacity: 0; transform: scale(0.5); } 80% { transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export function GameReveal({ game, players, updateScore, onBack }) {
    const [localScores, setLocalScores] = useState({});
    const [teamView, setTeamView] = useState(false);
    const [teams, setTeams] = useState({ teamA: [], teamB: [] });
    const [showDraft, setShowDraft] = useState(false);

    const isTeamGame = game.type === 'TEAM';

    useEffect(() => {
        const initial = {};
        players.forEach(p => {
            initial[p.id] = p.scores[game.id] || '';
        });
        setLocalScores(initial);

        // Auto-open team view if it's a team game
        if (isTeamGame) {
            setTeamView(true);
        }
    }, [game.id, players, isTeamGame]);

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

    const handleDraftComplete = (generatedTeams) => {
        setTeams(generatedTeams);
        setShowDraft(false);
        setTeamView(true);
    };

    return (
        <>
            {showDraft && <TeamDraft players={players} onComplete={handleDraftComplete} />}

            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                zIndex: 500,
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2rem'
            }}>
                <div
                    className="glass-card"
                    style={{
                        width: '100%', maxWidth: '1000px', maxHeight: '90vh',
                        display: 'flex', flexDirection: 'column',
                        animation: 'slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                        padding: 0,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                >

                    {/* Header Section */}
                    <div style={{
                        padding: '2rem 3rem 1rem 3rem',
                        textAlign: 'center',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={onBack}
                            style={{
                                position: 'absolute', top: '2rem', right: '2rem',
                                background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%',
                                width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem', color: '#636e72'
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{game.icon}</div>

                        <div style={{
                            display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '8px',
                            background: isTeamGame ? '#e17055' : '#00b894', color: 'white',
                            fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '1px'
                        }}>
                            {isTeamGame ? 'TEAM EVENT' : 'INDIVIDUAL CHALLENGE'}
                        </div>

                        <h1 style={{ fontSize: '3rem', color: '#2d3436', marginBottom: '0.5rem' }}>{game.name}</h1>
                        <p style={{ fontSize: '1.2rem', color: '#6c5ce7', fontWeight: 600 }}>{game.brief}</p>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '3rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>

                        {/* Left Col: Rules & Teams */}
                        <div>
                            {/* Team Generator */}
                            <div style={{ marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: '#b2bec3', letterSpacing: '2px', fontWeight: 700 }}>TEAMS</h3>
                                    <button className="glass-btn-ghost" onClick={() => setShowDraft(true)} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                        {teams.teamA.length > 0 ? '🔄 Restart Draft' : '🎲 Start Team Draft'}
                                    </button>
                                </div>

                                {teamView && teams.teamA.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ background: 'rgba(255,118,117,0.1)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,118,117,0.3)' }}>
                                            <h4 style={{ color: '#d63031', marginBottom: '0.5rem' }}>TEAM RED</h4>
                                            {teams.teamA.map(p => <div key={p.id} style={{ fontSize: '1rem', fontWeight: 600 }}>• {p.name}</div>)}
                                        </div>
                                        <div style={{ background: 'rgba(116,185,255,0.1)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(116,185,255,0.3)' }}>
                                            <h4 style={{ color: '#0984e3', marginBottom: '0.5rem' }}>TEAM BLUE</h4>
                                            {teams.teamB.map(p => <div key={p.id} style={{ fontSize: '1rem', fontWeight: 600 }}>• {p.name}</div>)}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', fontStyle: 'italic', color: '#b2bec3' }}>
                                        Click 'Start Team Draft' to assign players to Red vs Blue.
                                    </div>
                                )}
                            </div>

                            <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: '#b2bec3', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 700 }}>Instructions</h3>

                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {game.rules?.map((r, i) => (
                                    <li key={i} style={{
                                        marginBottom: '1rem', padding: '1rem',
                                        background: 'rgba(255,255,255,0.5)', borderRadius: '12px',
                                        display: 'flex', gap: '1rem', alignItems: 'center',
                                        fontSize: '1.1rem', color: '#2d3436'
                                    }}>
                                        <span style={{ color: '#6c5ce7', fontWeight: 900 }}>{i + 1}.</span>
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Col: Scores */}
                        <div style={{ background: '#fdfdfd', borderRadius: '24px', padding: '2rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>Results</h3>
                                <div style={{ fontSize: '0.9rem', color: '#b2bec3' }}>Enter Points</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {players.map(player => (
                                    <div key={player.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{player.name}</span>
                                        <input
                                            type="number"
                                            className="glass-input"
                                            style={{ width: '80px', padding: '0.8rem', textAlign: 'center', background: 'white' }}
                                            placeholder="-"
                                            value={localScores[player.id]}
                                            onChange={(e) => handleScoreChange(player.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '3rem' }}>
                                <button className="glass-btn" onClick={handleSave} style={{ width: '100%', borderRadius: '20px' }}>
                                    Save & Close
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
                <style>{`
          @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
            </div>
        </>
    );
}
