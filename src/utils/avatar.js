export const getAvatarUrl = (seed) => {
    // Base Config for "Cute" Look
    const BASE_PARAMS = '&skinColor=f2d3b1,ffdfbf&backgroundColor=b6e3f4,c0aede,d1d4f9';

    // Gender Specific Logic based on Seed Prefix
    let styleParams = '';

    if (seed?.startsWith('boy-')) {
        // Boys: Decent Short Hair
        styleParams = '&hair=short01,short02,short03,short04,short05,short06,short07,short08,short09,short10';
    } else if (seed?.startsWith('girl-')) {
        // Girls: Cute Long Hair
        styleParams = '&hair=long01,long02,long03,long04,long05,long10,long12';
    } else {
        // Fallback for random seeds or legacy
        styleParams = '&hairColor=2c1b18,4a312c';
    }

    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}${BASE_PARAMS}${styleParams}`;
};
