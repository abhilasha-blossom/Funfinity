import React, { useState, useEffect } from 'react';

// Multi-Team "Battle Royale" Draft Component
const TeamDraft = ({ players, onComplete, onBack }) => {
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

        if (numTeams <= 1) {
            // If everyone fits in one team, just assign all to one team and skip draft
            onComplete([players]);
            return;
        }

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
                <div style={{ zIndex: 100, background: 'rgba(25, 25, 25, 0.9)', padding: '3rem', borderRadius: '24px', border: '1px solid #636e72', textAlign: 'center', minWidth: '400px', position: 'relative' }}>

                    <button
                        onClick={onBack}
                        style={{
                            position: 'absolute', top: '-4rem', left: '50%', transform: 'translateX(-50%)',
                            background: 'white', border: 'none', borderRadius: '50px',
                            padding: '0.8rem 2rem', fontWeight: 900, cursor: 'pointer',
                            fontSize: '1rem', color: '#2d3436'
                        }}
                    >
                        ← CHANGE MODE
                    </button>

                    <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>DRAFT SETUP</h2>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ color: '#b2bec3', display: 'block', marginBottom: '1rem', fontSize: '1.2rem' }}>PLAYER SELECTION</label>
                        <div style={{ fontSize: '3rem', color: '#ff7675', fontWeight: 900, marginBottom: '1rem' }}>
                            {teamSize} <span style={{ fontSize: '1.5rem', color: 'white' }}>Players per Team</span>
                        </div>
                        <input
                            type="range" min="1" max="5" value={teamSize}
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
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem',
                        zIndex: 10, boxSizing: 'border-box'
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

export function GameReveal({ game, players, updateScore, toggleGameComplete, updateGame, onBack }) {
    const [localScores, setLocalScores] = useState({});
    const [teamScores, setTeamScores] = useState({});
    const [generatedTeams, setGeneratedTeams] = useState([]);

    // Stages: 'INFO' -> 'MODE_SELECT' -> 'DRAFT' -> 'GAME' (Active Scoring) -> 'RESULTS' (Final Scoreboard)
    const [stage, setStage] = useState(game.completed ? 'RESULTS' : 'INFO');
    const [teamView, setTeamView] = useState(false);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ brief: game.brief, rules: game.rules || [] });

    // Constants
    const COLORS = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8', '#00b894', '#fdcb6e'];
    const isTeamGame = game.type === 'TEAM';

    useEffect(() => {
        const initial = {};
        players.forEach(p => {
            initial[p.id] = p.scores[game.id] || '';
        });
        setLocalScores(initial);
    }, [game.id, players]);

    // Sync edit data when game changes (or initially)
    useEffect(() => {
        setEditData({ brief: game.brief, rules: game.rules || [] });
    }, [game]);


    const handleScoreChange = (playerId, value) => {
        if (value === '' || !isNaN(value)) {
            setLocalScores(prev => ({ ...prev, [playerId]: value }));
        }
    };

    const handleTeamScoreChange = (teamIdx, value) => {
        if (value === '' || !isNaN(value)) {
            setTeamScores(prev => ({ ...prev, [teamIdx]: value }));
        }
    };

    const handleSave = (keepOpen = false) => {
        if (teamView && generatedTeams.length > 0) {
            // Distribute Team Scores
            generatedTeams.forEach((team, idx) => {
                const tScore = Number(teamScores[idx]);
                if (!isNaN(tScore) && teamScores[idx] !== undefined && teamScores[idx] !== '') {
                    const splitScore = tScore / team.length;
                    team.forEach(p => {
                        updateScore(p.id, game.id, splitScore);
                        setLocalScores(prev => ({ ...prev, [p.id]: splitScore }));
                    });
                }
            });
        } else {
            // Individual Scores
            players.forEach(p => {
                const val = localScores[p.id];
                const numVal = val === '' ? null : Number(val);
                updateScore(p.id, game.id, numVal);
            });
        }

        if (!keepOpen) {
            onBack();
        }
    };

    const handleDraftComplete = (teamsArray) => {
        setGeneratedTeams(teamsArray);
        setTeamView(true);
        setStage('VERSUS');
    };

    // Mode Select Logic
    const selectMode = (mode) => {
        if (mode === 'SOLO') {
            setTeamView(false);
            setQueue([...players].sort(() => 0.5 - Math.random()).slice(1));
            setActivePlayer([...players].sort(() => 0.5 - Math.random())[0]);
            setFinishedPlayers([]);
            setStage('GAME');
        } else if (mode === '1V1') {
            const shuffled = [...players].sort(() => 0.5 - Math.random());
            setGeneratedTeams([[shuffled[0]], [shuffled[1]]]);
            setTeamScores({});
            setTeamView(true);
            setStage('VERSUS');
        } else {
            setTeamView(true);
            setStage('DRAFT');
        }
    };

    // Game/Scoring Logic (Solo)
    const [queue, setQueue] = useState([]);
    const [activePlayer, setActivePlayer] = useState(null);
    const [finishedPlayers, setFinishedPlayers] = useState([]);

    const handleNextPlayer = () => {
        if (!activePlayer) return;
        setFinishedPlayers(prev => [...prev, activePlayer]);
        // Auto-save individual score as we go
        updateScore(activePlayer.id, game.id, Number(localScores[activePlayer.id] || 0));

        if (queue.length > 0) {
            setActivePlayer(queue[0]);
            setQueue(prev => prev.slice(1));
            // Pre-fill score input with 0 for next player if empty
            if (!localScores[queue[0].id]) {
                setLocalScores(prev => ({ ...prev, [queue[0].id]: '' }));
            }
        } else {
            setActivePlayer(null); // Game Over
            finishGame();
        }
    };

    const startScoring = () => {
        setStage('GAME');
    };

    const finishGame = () => {
        handleSave(true); // Save scores
        if (!game.completed) {
            toggleGameComplete(game.id);
        }
        setStage('RESULTS');
    };

    const saveGameDetails = () => {
        updateGame(game.id, editData);
        setIsEditing(false);
    };

    // Render Logic for different View States
    return (
        <>
            {/* STAGE: VERSUS REVEAL */}
            {stage === 'VERSUS' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #2d3436, #000000)', zIndex: 2000,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Outfit', sans-serif"
                }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at center, rgba(108, 92, 231, 0.2) 0%, transparent 70%)', zIndex: 0 }} />
                    <h1 style={{ color: 'white', fontSize: '4rem', marginBottom: '2rem', zIndex: 10, textTransform: 'uppercase', letterSpacing: '10px', fontWeight: 900, textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                        {generatedTeams.length === 2 && generatedTeams[0].length === 1 ? 'DUEL' : 'TEAM BATTLE'}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', zIndex: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {generatedTeams.map((team, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <div style={{ fontSize: '5rem', color: '#ff7675', fontWeight: 900, fontStyle: 'italic', textShadow: '0 0 30px #ff7675' }}>VS</div>}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: idx === 0 ? 'slideRight 1s ease' : 'slideLeft 1s ease' }}>
                                    {team.length === 1 && (
                                        <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: `8px solid ${COLORS[idx % COLORS.length]}`, overflow: 'hidden', marginBottom: '1rem', background: '#ecf0f1', boxShadow: `0 0 50px ${COLORS[idx % COLORS.length]}44` }}>
                                            <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${team[0].avatarSeed}&skinColor=f2d3b1,ffdfbf&hairColor=2c1b18,4a312c`} alt={team[0].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <h2 style={{ fontSize: '3rem', color: COLORS[idx % COLORS.length], textTransform: 'uppercase', fontWeight: 900, marginBottom: '0.5rem' }}>{team.length === 1 ? team[0].name : `TEAM ${idx + 1}`}</h2>
                                    {team.length > 1 && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', maxWidth: '300px', textAlign: 'center' }}>{team.map(p => p.name).join(' • ')}</div>}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <button onClick={startScoring} className="glass-btn" style={{ marginTop: '4rem', padding: '1.5rem 4rem', fontSize: '2rem', zIndex: 10, background: 'white', color: 'black', fontWeight: 900, border: 'none', boxShadow: '0 0 30px rgba(255,255,255,0.5)' }}>START MATCH ⚔️</button>
                    <style>{`@keyframes slideRight { from { transform: translateX(-100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideLeft { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
                </div>
            )}

            {/* STAGE: SOLO SCORING */}
            {stage === 'GAME' && !teamView && activePlayer && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e272e, #000000)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif" }}>
                    <button onClick={onBack} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', fontSize: '1.5rem', color: 'white', zIndex: 100 }}>✕</button>
                    <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '5px', marginBottom: '2rem', fontSize: '1.5rem' }}>PLAYER {finishedPlayers.length + 1} / {players.length}</div>
                    <div style={{ width: '250px', height: '250px', borderRadius: '50%', border: '10px solid #6c5ce7', overflow: 'hidden', marginBottom: '2rem', background: '#ecf0f1', boxShadow: '0 0 60px rgba(108, 92, 231, 0.4)', animation: 'pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${activePlayer.avatarSeed}&skinColor=f2d3b1,ffdfbf&hairColor=2c1b18,4a312c`} alt={activePlayer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h1 style={{ color: 'white', fontSize: '5rem', marginBottom: '3rem', fontWeight: 900 }}>{activePlayer.name}</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                        <input type="number" autoFocus className="glass-input" style={{ width: '300px', height: '120px', fontSize: '5rem', textAlign: 'center', borderRadius: '30px', border: '4px solid #6c5ce7', color: 'white', background: 'rgba(255,255,255,0.1)', fontWeight: 700 }} placeholder="0" value={localScores[activePlayer.id] || ''} onChange={(e) => handleScoreChange(activePlayer.id, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleNextPlayer(); }} />
                        <div style={{ fontSize: '1.2rem', color: '#b2bec3' }}>Enter Points & Press Enter</div>
                    </div>
                    <button className="glass-btn" onClick={handleNextPlayer} style={{ marginTop: '4rem', padding: '1.5rem 5rem', fontSize: '2rem', background: 'white', color: 'black', fontWeight: 900 }}>NEXT PLAYER ➡</button>
                </div>
            )}

            {/* STAGE: MODE SELECT */}
            {stage === 'MODE_SELECT' && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={() => setStage('INFO')} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'white', border: 'none', borderRadius: '50px', padding: '1rem 2rem', fontWeight: 900, cursor: 'pointer', fontSize: '1rem' }}>← BACK TO DETAILS</button>
                    <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '4rem' }}>SELECT CHALLENGE MODE</h1>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['SOLO', '1V1', 'TEAM'].map(mode => (
                            <div key={mode} onClick={() => selectMode(mode)} className="mode-card" style={{ background: mode === 'SOLO' ? 'linear-gradient(135deg, #a29bfe, #6c5ce7)' : mode === '1V1' ? 'linear-gradient(135deg, #e17055, #d63031)' : 'linear-gradient(135deg, #fdcb6e, #e1b12c)', width: '250px', height: '350px', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '4px solid rgba(255,255,255,0.2)', transition: 'transform 0.3s' }}>
                                <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>{mode === 'SOLO' ? '👤' : mode === '1V1' ? '⚔️' : '👥'}</div>
                                <h2 style={{ color: 'white', fontSize: '2rem' }}>{mode}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem' }}>{mode === 'SOLO' ? 'Individual' : mode === '1V1' ? 'Duel Mode' : 'Squad Battle'}</p>
                            </div>
                        ))}
                    </div>
                    <style>{`.mode-card:hover { transform: translateY(-20px) scale(1.05); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }`}</style>
                </div>
            )}

            {/* STAGE: TEAM DRAFT */}
            {stage === 'DRAFT' && <TeamDraft players={players} onComplete={handleDraftComplete} onBack={() => setStage('MODE_SELECT')} />}

            {/* MAIN INFO / SCORING / RESULTS PANEL */}
            {(stage === 'INFO' || stage === 'GAME' || stage === 'RESULTS') && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 500, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)', padding: 0, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>

                        {/* Header Section */}
                        <div className="reveal-header" style={{ position: 'relative', background: game.completed ? 'linear-gradient(to right, #2ecc71, #27ae60)' : '' }}>
                            <button onClick={onBack} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem', color: game.completed ? 'white' : '#636e72', zIndex: 10 }}>✕</button>

                            {/* Toggle Completed Status */}
                            <button onClick={() => toggleGameComplete(game.id)} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '0.5rem 1rem', fontSize: '0.9rem', color: game.completed ? 'white' : '#636e72', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {game.completed ? '✓ COMPLETED' : '⭕ IN PROGRESS'}
                            </button>

                            {isEditing ? (
                                <div style={{ width: '100%', marginTop: '3rem' }}>
                                    <input value={editData.brief} onChange={e => setEditData({ ...editData, brief: e.target.value })} className="glass-input" style={{ width: '100%', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600, color: '#6c5ce7' }} placeholder="Brief Description" />
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem', marginTop: '1rem' }}>{game.icon}</div>
                                    <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '8px', background: isTeamGame ? '#e17055' : '#00b894', color: 'white', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>{isTeamGame ? 'TEAM EVENT' : 'INDIVIDUAL CHALLENGE'}</div>
                                    <h1 style={{ fontSize: '3rem', color: game.completed ? 'white' : '#2d3436', marginBottom: '0.5rem' }}>{game.name}</h1>
                                    <p style={{ fontSize: '1.2rem', color: game.completed ? 'rgba(255,255,255,0.9)' : '#6c5ce7', fontWeight: 600 }}>{game.brief}</p>
                                </>
                            )}
                        </div>

                        <div className="game-reveal-grid" style={{ overflowY: 'auto' }}>
                            {/* Left Col: Rules */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: '#b2bec3', letterSpacing: '2px', fontWeight: 700 }}>Instructions</h3>
                                    {!game.completed && (
                                        <button onClick={() => { if (isEditing) saveGameDetails(); else setIsEditing(true); }} className="glass-btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                            {isEditing ? '💾 Save Changes' : '✏️ Edit'}
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <textarea
                                        value={editData.rules.join('\n')}
                                        onChange={e => setEditData({ ...editData, rules: e.target.value.split('\n') })}
                                        className="glass-input"
                                        style={{ width: '100%', minHeight: '300px', fontSize: '1rem', lineHeight: '1.6' }}
                                        placeholder="Enter rules, one per line..."
                                    />
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {game.rules?.map((r, i) => (
                                            <li key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1.1rem', color: '#2d3436' }}>
                                                <span style={{ color: '#6c5ce7', fontWeight: 900 }}>{i + 1}.</span> {r}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Right Col: Action / Results */}
                            <div style={{ background: '#fdfdfd', borderRadius: '24px', padding: '2rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                                {stage === 'INFO' && (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2d3436' }}>Ready to Play?</h3>
                                        <p style={{ color: '#636e72', marginBottom: '2rem' }}>Configure teams and mode to start scoring.</p>
                                        <button className="glass-btn" onClick={() => setStage('MODE_SELECT')} style={{ width: '100%', borderRadius: '20px', padding: '1.2rem', fontSize: '1.2rem' }}>CONFIGURE MISSION</button>

                                        {/* Quick Score View Link */}
                                        <button onClick={() => setStage('RESULTS')} style={{ background: 'none', border: 'none', marginTop: '1rem', color: '#b2bec3', cursor: 'pointer', textDecoration: 'underline' }}>View Scoreboard</button>
                                    </div>
                                )}

                                {(stage === 'GAME' || stage === 'RESULTS') && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                            <h3 style={{ fontSize: '1.5rem' }}>{stage === 'RESULTS' ? 'Final Scoreboard' : 'Live Scoring'}</h3>
                                            {stage === 'RESULTS' && <button className="glass-btn" onClick={() => setStage('INFO')} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Back to Info</button>}
                                        </div>

                                        {/* Scoreboard List */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '500px', overflowY: 'auto' }}>
                                            {players
                                                .sort((a, b) => (Number(localScores[b.id]) || 0) - (Number(localScores[a.id]) || 0)) // Sort by score DESC
                                                .map(p => (
                                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', borderBottom: '1px solid #eee', background: 'white', borderRadius: '12px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                                                                <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${p.avatarSeed}&skinColor=f2d3b1,ffdfbf&hairColor=2c1b18,4a312c`} alt={p.name} style={{ width: '100%', height: '100%' }} />
                                                            </div>
                                                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6c5ce7' }}>{localScores[p.id] || 0} pts</span>
                                                            {/* Inline Edit Functionality */}
                                                            <button
                                                                onClick={() => {
                                                                    const newScore = prompt(`Update score for ${p.name}`, localScores[p.id] || 0);
                                                                    if (newScore !== null) {
                                                                        handleScoreChange(p.id, newScore);
                                                                        updateScore(p.id, game.id, Number(newScore));
                                                                    }
                                                                }}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3, fontSize: '1rem' }}
                                                            >
                                                                ✏️
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                        {stage === 'GAME' && teamView && (
                                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                                <p style={{ fontStyle: 'italic', color: '#b2bec3' }}>To set team scores, please use the Team Scoring inputs above (if visible) or manually edit individual scores here.</p>
                                                {/* Team Scoring UI was removed from this view to simplify, focusing on the result list. If strict team scoring needed, can add back. */}
                                                <button className="glass-btn" onClick={finishGame} style={{ marginTop: '1rem', width: '100%' }}>FINISH & LOCK SCORES</button>
                                            </div>
                                        )}
                                        {stage === 'GAME' && !teamView && (
                                            <div style={{ marginTop: '2rem' }}>
                                                <button className="glass-btn" onClick={finishGame} style={{ width: '100%', background: '#2ecc71', color: 'white', boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)' }}>✅ COMPLETE MISSION</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`.glass-input:focus { outline: none; border-color: #a29bfe; box-shadow: 0 0 0 4px rgba(162, 155, 254, 0.2); }`}</style>
        </>
    );
}
