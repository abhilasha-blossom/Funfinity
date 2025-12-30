import React, { useState, useEffect } from 'react';

// Multi-Team "Battle Royale" Draft Component
const TeamDraft = ({ players, onComplete }) => {
    const [stage, setStage] = useState('SETUP'); // SETUP, READY, DRAFTING, DONE
    const [teamSize, setTeamSize] = useState(2);
    const [teams, setTeams] = useState([]); // Array of arrays
    const [unassigned, setUnassigned] = useState([]);
    const [currentName, setCurrentName] = useState("PRESS START");
    const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
    const [animationState, setAnimationState] = useState('IDLE'); // IDLE, SPINNING, REVEALED

    const COLORS = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8', '#00b894', '#fdcb6e'];

    // Initialize Unassigned
    useEffect(() => {
        setUnassigned([...players].sort(() => 0.5 - Math.random()));
    }, [players]);

    const handleSetupConfirm = () => {
        const numTeams = Math.ceil(players.length / teamSize);
        // Initialize empty teams
        setTeams(Array(numTeams).fill([]));
        setStage('READY');
    };

    const startDraft = () => {
        setStage('DRAFTING');
        processNextPick();
    };

    const processNextPick = () => {
        setAnimationState('SPINNING');
    };

    // Spinning Effect
    useEffect(() => {
        let interval;
        if (animationState === 'SPINNING') {
            let spinCount = 0;
            interval = setInterval(() => {
                const randomIdx = Math.floor(Math.random() * unassigned.length);
                setCurrentName(unassigned[randomIdx]?.name || "???");
                spinCount++;

                if (spinCount > 15) {
                    clearInterval(interval);
                    finalizePick();
                }
            }, 50);
        }
        return () => clearInterval(interval);
    }, [animationState]);

    const finalizePick = () => {
        const pickedPlayer = unassigned[0];
        setCurrentName(pickedPlayer.name);
        setAnimationState('REVEALED');

        setTimeout(() => {
            // Assign to current team
            setTeams(prev => {
                const newTeams = [...prev];
                newTeams[currentTeamIdx] = [...newTeams[currentTeamIdx], pickedPlayer];
                return newTeams;
            });

            // Prepare next state
            setUnassigned(prev => prev.slice(1));

            // Move to next team (Round Robin)
            const nextTeamIdx = (currentTeamIdx + 1) % teams.length;
            setCurrentTeamIdx(nextTeamIdx);

            if (unassigned.length > 1) {
                processNextPick();
            } else {
                setStage('DONE');
                // Wait for final render then complete
                setTimeout(() => {
                    // Pass the final teams array
                    // We need to pass it in a way the parent expects, or update parent to handle array
                    // For now, let's pass the array and let parent handle it
                    setTeams(prev => {
                        onComplete(prev);
                        return prev;
                    });
                }, 1500);
            }
        }, 800);
    };

    if (stage === 'DONE') return null;

    const currentTeamColor = COLORS[currentTeamIdx % COLORS.length];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: '#0a0a0a', zIndex: 1000,
            overflow: 'hidden',
            fontFamily: "'Outfit', sans-serif",
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            {/* Background Grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                zIndex: 0
            }}></div>

            {stage === 'SETUP' && (
                <div style={{ zIndex: 100, background: 'rgba(25, 25, 25, 0.9)', padding: '3rem', borderRadius: '24px', border: '1px solid #636e72', textAlign: 'center', minWidth: '400px' }}>
                    <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>DRAFT SETUP</h2>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ color: '#b2bec3', display: 'block', marginBottom: '1rem', fontSize: '1.2rem' }}>TEAMS CONFIGURATION</label>
                        <div style={{ fontSize: '3rem', color: '#ff7675', fontWeight: 900, marginBottom: '1rem' }}>
                            {teamSize} <span style={{ fontSize: '1.5rem', color: 'white' }}>Players per Team</span>
                        </div>
                        <input
                            type="range" min="2" max={Math.floor(players.length / 2) || 2} value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#ff7675' }}
                        />
                        <div style={{ marginTop: '1rem', color: '#636e72' }}>
                            Total Players: {players.length} → Will generate <strong style={{ color: 'white' }}>{Math.ceil(players.length / teamSize)} Teams</strong>
                        </div>
                    </div>

                    <button
                        onClick={handleSetupConfirm}
                        className="glass-btn"
                        style={{ fontSize: '1.2rem', padding: '1rem 3rem', width: '100%' }}
                    >
                        CONFIRM & ENTER ARENA
                    </button>
                </div>
            )}

            {(stage === 'READY' || stage === 'DRAFTING') && (
                <>
                    {/* Teams HUD Grid */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', padding: '2rem',
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem',
                        zIndex: 10
                    }}>
                        {teams.map((team, idx) => (
                            <div key={idx} style={{
                                flex: '1 1 200px',
                                background: idx === currentTeamIdx && stage === 'DRAFTING' ? `rgba(${parseInt(COLORS[idx % COLORS.length].slice(1, 3), 16)}, ${parseInt(COLORS[idx % COLORS.length].slice(3, 5), 16)}, ${parseInt(COLORS[idx % COLORS.length].slice(5, 7), 16)}, 0.1)` : 'rgba(255,255,255,0.05)',
                                border: `2px solid ${COLORS[idx % COLORS.length]}`,
                                borderRadius: '12px', padding: '1rem',
                                transition: 'all 0.3s',
                                transform: idx === currentTeamIdx && stage === 'DRAFTING' ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: idx === currentTeamIdx && stage === 'DRAFTING' ? `0 0 30px ${COLORS[idx % COLORS.length]}44` : 'none'
                            }}>
                                <h3 style={{ color: COLORS[idx % COLORS.length], margin: '0 0 1rem 0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>TEAM {idx + 1}</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {team.map((p, pIdx) => (
                                        <span key={pIdx} style={{
                                            background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', color: 'white',
                                            animation: 'pop 0.3s'
                                        }}>
                                            {p.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Central Spinner */}
                    <div style={{ zIndex: 20, textAlign: 'center' }}>
                        {stage === 'READY' ? (
                            <button
                                onClick={startDraft}
                                style={{
                                    fontSize: '2rem', padding: '1.5rem 5rem', borderRadius: '4px',
                                    background: 'transparent', color: 'white',
                                    border: '4px solid white', fontWeight: 900, letterSpacing: '2px',
                                    cursor: 'pointer', boxShadow: '0 0 30px rgba(255,255,255,0.3)',
                                    animation: 'pulse 1.5s infinite', textTransform: 'uppercase'
                                }}
                            >
                                INITIATE DRAFT
                            </button>
                        ) : (
                            <div style={{ transform: 'scale(1.2)' }}>
                                <div style={{ fontSize: '1.5rem', color: '#b2bec3', letterSpacing: '5px', marginBottom: '1rem' }}>RECRUITING FOR</div>
                                <div style={{
                                    fontSize: '3rem', fontWeight: 900,
                                    color: currentTeamColor,
                                    marginBottom: '2rem', textShadow: `0 0 20px ${currentTeamColor}`
                                }}>
                                    TEAM {currentTeamIdx + 1}
                                </div>

                                <div style={{
                                    fontSize: '4rem', fontWeight: 900, color: 'white',
                                    padding: '2rem 4rem',
                                    border: `4px solid ${currentTeamColor}`,
                                    background: 'rgba(0,0,0,0.8)',
                                    textShadow: animationState === 'REVEALED' ? `0 0 30px ${currentTeamColor}` : 'none',
                                    transform: animationState === 'REVEALED' ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.1s', fontFamily: 'monospace'
                                }}>
                                    {currentName}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
            <style>{`
                @keyframes pulse { 0% { opacity: 0.8; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1.02); } 100% { opacity: 0.8; transform: scale(0.98); } }
                @keyframes pop { 0% { opacity: 0; transform: scale(0.5); } 80% { transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export function GameReveal({ game, players, updateScore, onBack }) {
    const [localScores, setLocalScores] = useState({});
    const [teamView, setTeamView] = useState(false);
    const [generatedTeams, setGeneratedTeams] = useState([]); // Now an array of arrays
    const [showDraft, setShowDraft] = useState(false);

    // Constants
    const COLORS = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8', '#00b894', '#fdcb6e'];

    const isTeamGame = game.type === 'TEAM';

    useEffect(() => {
        const initial = {};
        players.forEach(p => {
            initial[p.id] = p.scores[game.id] || '';
        });
        setLocalScores(initial);

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

    const handleDraftComplete = (teamsArray) => {
        setGeneratedTeams(teamsArray);
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
                            {/* Team Generator (Only for Team Games) */}
                            {isTeamGame && (
                                <div style={{ marginBottom: '3rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: '#b2bec3', letterSpacing: '2px', fontWeight: 700 }}>TEAMS</h3>
                                        <button className="glass-btn-ghost" onClick={() => setShowDraft(true)} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                            {generatedTeams.length > 0 ? '🔄 Restart Draft' : '🎲 Start Team Draft'}
                                        </button>
                                    </div>

                                    {teamView && generatedTeams.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            {generatedTeams.map((team, idx) => (
                                                <div key={idx} style={{
                                                    background: `rgba(${parseInt(COLORS[idx % COLORS.length].slice(1, 3), 16)}, ${parseInt(COLORS[idx % COLORS.length].slice(3, 5), 16)}, ${parseInt(COLORS[idx % COLORS.length].slice(5, 7), 16)}, 0.1)`,
                                                    padding: '1rem', borderRadius: '16px',
                                                    border: `1px solid ${COLORS[idx % COLORS.length]}88`
                                                }}>
                                                    <h4 style={{ color: COLORS[idx % COLORS.length], marginBottom: '0.5rem', textTransform: 'uppercase' }}>TEAM {idx + 1}</h4>
                                                    {team.map(p => <div key={p.id} style={{ fontSize: '1rem', fontWeight: 600 }}>• {p.name}</div>)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', fontStyle: 'italic', color: '#b2bec3' }}>
                                            Click 'Start Team Draft' to configure and assign teams.
                                        </div>
                                    )}
                                </div>
                            )}

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
