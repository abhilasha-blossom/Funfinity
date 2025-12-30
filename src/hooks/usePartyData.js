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
                setPlayers(parsed.players);
            } else {
                setPlayers(DEFAULT_PLAYERS.map(name => ({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name,
                    scores: {}
                })));
            }

            // Merge saved games with initial games to ensure new predefined games appear if we update code
            // But for now, we just trust the saved games if they exist, or fallback to initial
            if (parsed.games && parsed.games.length > 0) {
                // Merge saved state (active status) with fresh content (rules, briefs)
                const mergedGames = INITIAL_GAMES.map(initGame => {
                    const savedGame = parsed.games.find(g => g.id === initGame.id);
                    return savedGame ? { ...initGame, active: savedGame.active } : initGame;
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

    const addPlayer = (name) => {
        setPlayers(prev => [
            ...prev,
            {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name,
                scores: {}
            }
        ]);
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

    return {
        players,
        games,
        addPlayer,
        removePlayer,
        updateScore,
        toggleGameActive,
        addCustomGame,
        deleteGame,
        isLoaded
    };
};
