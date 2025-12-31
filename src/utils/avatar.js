export const getAvatarUrl = (seed) => {
    // Base Config for "Cute" Look
    const BASE_PARAMS = '&skinColor=f2d3b1,ffdfbf&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=0e0e0e';

    // Gender Specific Logic based on Seed Prefix
    let styleParams = '';

    if (seed?.startsWith('boy-')) {
        // Boys: Decent Short Hair
        styleParams = '&hair=short01,short02,short03,short04,short05,short09,short10';
    } else if (seed?.startsWith('girl-')) {
        // Girls: Long Hair with Hairclips (Flowers/Bands)
        styleParams = '&hair=long03,long08,long18';
    } else {
        // Fallback for random seeds or legacy
        styleParams = '&hairColor=0e0e0e';
    }

    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}${BASE_PARAMS}${styleParams}`;
};
