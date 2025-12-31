import { useState, useEffect, createContext, useContext, useRef } from 'react';

const SoundContext = createContext();

// Reliable fun UI sounds
const SOUNDS = {
    hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Soft pop (Keep remote or download if needed)
    click: '/click.mp3',
    open: 'https://assets.mixkit.co/active_storage/sfx/2044/2044-preview.mp3',
    success: '/success.mp3',
    win: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    tick: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Soft pop for tick (less annoying)
    alarm: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // Alarm clock buzzer ring
    eraser: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
    cheer: '/cheer.mp3',
    bgm: '/bgm.mp3',
};

export const SoundProvider = ({ children }) => {
    const [isBgmOn, setIsBgmOn] = useState(() => {
        const saved = localStorage.getItem('funfinity_bgm_v2');
        return saved !== null ? JSON.parse(saved) : false;
    });

    const audioRefs = useRef({});

    useEffect(() => {
        localStorage.setItem('funfinity_bgm_v2', JSON.stringify(isBgmOn));
    }, [isBgmOn]);

    // Preload sounds
    useEffect(() => {
        Object.entries(SOUNDS).forEach(([key, url]) => {
            const audio = new Audio(url);
            audio.volume = key === 'bgm' ? 0.3 : 0.4;
            if (key === 'bgm') {
                audio.loop = true;
                audio.addEventListener('error', (e) => console.error("Error loading BGM:", e));
            }
            audioRefs.current[key] = audio;
        });
    }, []);

    // Handle BGM State
    useEffect(() => {
        const bgm = audioRefs.current['bgm'];
        if (!bgm) return;

        if (!isBgmOn) {
            bgm.pause();
        } else if (bgm.paused && bgm.currentTime > 0) {
            // Resume if it was playing before
            bgm.play().catch(() => { });
        }
    }, [isBgmOn]);

    const playSound = (soundKey) => {
        // Piggyback: Try to start BGM on any sound interaction (only if BGM is enabled)
        const bgm = audioRefs.current['bgm'];
        if (bgm && bgm.paused && isBgmOn) {
            bgm.play().catch(e => console.log("BGM Start Failed", e));
        }

        // Always play sound effects (except BGM which is controlled separately)
        if (soundKey === 'bgm') return;

        const audio = audioRefs.current[soundKey];
        if (audio) {
            audio.currentTime = 0; // Reset to start
            audio.play().catch(e => console.warn("Sound play failed", e));
        }
    };

    const toggleBgm = () => {
        setIsBgmOn(prev => !prev);
    };

    return (
        <SoundContext.Provider value={{ isBgmOn, toggleBgm, playSound }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        console.warn("useSound must be used within a SoundProvider");
        return { playSound: () => { }, isBgmOn: true, toggleBgm: () => { } };
    }
    return context;
};
