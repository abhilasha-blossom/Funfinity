import { useState, useEffect } from 'react';
import { INITIAL_GAMES } from '../data/initialGames';

const STORAGE_KEY = 'party_app_data_v5';

const DEFAULT_PLAYERS = [
    "Arnav", "Mohit", "Sagar", "Yashraj", "Harsh",
    "Ananya", "Shruti", "Nitya", "Raj", "Manish"
];

export const usePartyData = () => {
    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState(INITIAL_GAMES);
    const [isLoaded, setIsLoaded] = useState(false);

    const initializeDefaults = () => {
        // Specific seeds for the default 10 players
        // Boys: boy-1 to boy-7
        // Girls: girl-1 to girl-3
        // Mapping based on known names
        const NAME_TO_SEED = {
            "Arnav": "boy-1", "Mohit": "boy-2", "Sagar": "boy-3", "Yashraj": "boy-4", "Harsh": "boy-5",
            "Ananya": "girl-1", "Shruti": "girl-2", "Nitya": "girl-3",
            "Raj": "boy-6", "Manish": "boy-7"
        };

        setPlayers(DEFAULT_PLAYERS.map((name, index) => {
            // Fallback logic for safety, though mapped above
            const defaultSeed = index < 7 ? `boy-${index + 1}` : `girl-${index - 6}`;
            const seed = NAME_TO_SEED[name] || defaultSeed;

            return {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + index,
                name,
                avatarSeed: seed,
                scores: {}
            };
        }));
        setGames(INITIAL_GAMES);
    };

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);

                // Load Players
                if (parsed.players && parsed.players.length > 0) {
                    const patchedPlayers = parsed.players.map(p => ({
                        ...p,
                        avatarSeed: p.avatarSeed || Math.random().toString(36)
                    }));
                    setPlayers(patchedPlayers);
                } else {
                    initializeDefaults();
                }

                // Load and Merge Games
                if (parsed.games && parsed.games.length > 0) {
                    const mergedGames = INITIAL_GAMES.map(initGame => {
                        const savedGame = parsed.games.find(g => g.id === initGame.id);
                        if (savedGame) {
                            return {
                                ...initGame,
                                ...savedGame,
                                completed: savedGame.completed || false,
                                active: savedGame.active !== undefined ? savedGame.active : initGame.active
                            };
                        }
                        return { ...initGame, completed: false };
                    });
                    const customGames = parsed.games.filter(g => g.isCustom);
                    setGames([...mergedGames, ...customGames]);
                } else {
                    setGames(INITIAL_GAMES);
                }
            } catch (e) {
                console.error("Failed to parse party data:", e);
                initializeDefaults();
            }
        } else {
            initializeDefaults();
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

    return {
        players,
        games,
        isLoaded,
        addPlayer,
        removePlayer,
        updateScore,
        toggleGameActive,
        addCustomGame,
        deleteGame,
        updateGame,
        resetAllData,
        resetScores,
        updatePlayerAvatar,
        toggleGameComplete
    };
};
