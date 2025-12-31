import { useState, useEffect, createContext, useContext, useRef } from 'react';

const SoundContext = createContext();

// Reliable fun UI sounds
const SOUNDS = {
    hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Soft pop
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Positive click
    open: 'https://assets.mixkit.co/active_storage/sfx/2044/2044-preview.mp3', // Swoosh
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success chime
    win: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Celebration
    tick: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Tick
    alarm: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3', // Alarm
    eraser: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', // Soft scratch
    cheer: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Crowd applause
    cheer: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Crowd applause
    // Using local file in public folder for reliability
    bgm: '/bgm.mp3',
};

export const SoundProvider = ({ children }) => {
    const [isSoundOn, setIsSoundOn] = useState(() => {
        const saved = localStorage.getItem('funfinity_sound');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const audioRefs = useRef({});

    useEffect(() => {
        localStorage.setItem('funfinity_sound', JSON.stringify(isSoundOn));
    }, [isSoundOn]);

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

        if (!isSoundOn) {
            bgm.pause();
        } else if (bgm.paused && bgm.currentTime > 0) {
            // Resume if it was playing before
            bgm.play().catch(() => { });
        }
    }, [isSoundOn]);

    const playSound = (soundKey) => {
        if (!isSoundOn) return;

        // Piggyback: Try to start BGM on any sound interaction
        const bgm = audioRefs.current['bgm'];
        if (bgm && bgm.paused) {
            bgm.play().catch(e => console.log("BGM Start Failed", e));
        }

        const audio = audioRefs.current[soundKey];
        if (audio) {
            audio.currentTime = 0; // Reset to start
            audio.play().catch(e => console.warn("Sound play failed", e));
        }
    };

    const toggleSound = () => {
        setIsSoundOn(prev => !prev);
    };

    return (
        <SoundContext.Provider value={{ isSoundOn, toggleSound, playSound }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        console.warn("useSound must be used within a SoundProvider");
        return { playSound: () => { }, isSoundOn: true, toggleSound: () => { } };
    }
    return context;
};
