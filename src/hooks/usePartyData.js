import { useState, useEffect } from 'react';
import { INITIAL_GAMES } from '../data/initialGames';

const STORAGE_KEY = 'party_app_data_v1';

const DEFAULT_PLAYERS = [
    "Arnav", "Mohit", "Sagar", "Yashraj", "Harsh",
    "Ananya", "Shruti", "Nitya", "Raj", "Manish"
];

export const usePartyData = () => {
    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState(INITIAL_GAMES);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);

            // Use saved players, or default if empty
            if (parsed.players && parsed.players.length > 0) {
                // Ensure legacy players get an avatar if missing
                const patchedPlayers = parsed.players.map(p => ({
                    ...p,
                    avatarSeed: p.avatarSeed || Math.random().toString(36)
                }));
                setPlayers(patchedPlayers);
            } else {
                setPlayers(DEFAULT_PLAYERS.map((name) => {
                    const GIRLS_NAMES = ['Ananya', 'Shruti', 'Nitya']; // Specific overrides
                    const GIRL_SEEDS = ['Alice', 'Bella', 'Daisy', 'Eva', 'Fiona', 'Grace', 'Hanna', 'Ivy', 'Julia', 'Katie'];
                    const BOY_SEEDS = ['Adam', 'Ben', 'Caleb', 'Daniel', 'Ethan', 'Felix', 'Gabriel', 'Henry', 'Isaac', 'Jack'];

                    let seed;
                    if (GIRLS_NAMES.includes(name)) {
                        // Deterministic assignment for stability
                        seed = GIRL_SEEDS[GIRLS_NAMES.indexOf(name) % GIRL_SEEDS.length];
                    } else {
                        // Deterministic assignment for boys too based on name length/char code? 
                        // Or just random? Let's use index based on the full list to avoid "random" changes on reload if localstorage is cleared
                        const index = DEFAULT_PLAYERS.indexOf(name);
                        seed = BOY_SEEDS[index % BOY_SEEDS.length];
                    }

                    return {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        name,
                        avatarSeed: seed,
                        scores: {}
                    };
                }));
            }

            // Merge saved games with initial games to ensure new predefined games appear if we update code
            // But for now, we just trust the saved games if they exist, or fallback to initial
            if (parsed.games && parsed.games.length > 0) {
                // Merge saved state (active status) with fresh content (rules, briefs)
                const mergedGames = INITIAL_GAMES.map(initGame => {
                    const savedGame = parsed.games.find(g => g.id === initGame.id);
                    return savedGame ? { ...initGame, active: savedGame.active, completed: savedGame.completed || false } : { ...initGame, completed: false };
                });

                // Also retain any custom games the user added
                const customGames = parsed.games.filter(g => g.isCustom);

                setGames([...mergedGames, ...customGames]);
            } else {
                setGames(INITIAL_GAMES);
            }
        } else {
            // No saved data, initialize defaults
            setPlayers(DEFAULT_PLAYERS.map(name => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name,
                avatarSeed: Math.floor(Math.random() * 1000).toString(),
                scores: {}
            })));
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, games }));
        }
    }, [players, games, isLoaded]);

    const addPlayer = (name, avatarSeed) => {
        setPlayers(prev => [
            ...prev,
            {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name,
                avatarSeed: avatarSeed || Math.floor(Math.random() * 1000).toString(),
                scores: {}
            }
        ]);
    };

    const updatePlayerAvatar = (id, newSeed) => {
        setPlayers(prev => prev.map(p =>
            p.id === id ? { ...p, avatarSeed: newSeed } : p
        ));
    };

    const removePlayer = (id) => {
        setPlayers(prev => prev.filter(p => p.id !== id));
    };

    const updateScore = (playerId, gameId, score) => {
        setPlayers(prev => prev.map(p => {
            if (p.id !== playerId) return p;
            return {
                ...p,
                scores: {
                    ...p.scores,
                    [gameId]: score // score is a number or null
                }
            };
        }));
    };

    const toggleGameActive = (gameId) => {
        setGames(prev => prev.map(g =>
            g.id === gameId ? { ...g, active: !g.active } : g
        ));
    };

    const deleteGame = (gameId) => {
        setGames(prev => prev.filter(g => g.id !== gameId));
    };

    const addCustomGame = (game) => {
        setGames(prev => [
            ...prev,
            {
                ...game,
                id: Date.now(),
                active: true,
                isCustom: true
            }
        ]);
    };

    const updateGame = (gameId, updates) => {
        setGames(prev => prev.map(g =>
            g.id === gameId ? { ...g, ...updates } : g
        ));
    };


    const resetAllData = () => {
        localStorage.removeItem(STORAGE_KEY);
        // Force reload to clear all state and re-mount
        window.location.reload();
    };

    const resetScores = () => {
        setPlayers(prev => prev.map(p => ({ ...p, scores: {} })));
    };

    const toggleGameComplete = (gameId) => {
        setGames(prev => prev.map(g =>
            g.id === gameId ? { ...g, completed: !g.completed } : g
        ));
    };

    const resetGameScores = (gameId) => {
        // Reset all player scores for this specific game
        setPlayers(prev => prev.map(p => {
            const newScores = { ...p.scores };
            delete newScores[gameId];
            return { ...p, scores: newScores };
        }));

        // Mark game as not completed
        setGames(prev => prev.map(g =>
            g.id === gameId ? { ...g, completed: false } : g
        ));
    };

    return {
        players, games, addPlayer, removePlayer, updatePlayerAvatar,
        updateScore, toggleGameActive, addCustomGame, deleteGame,
        toggleGameComplete, updateGame, resetGameScores,
        resetAllData, resetScores,
        isLoaded
    };
};

