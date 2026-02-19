export const CreativeCore = {
    getMood: () => {
        const moods = ["ЦИФРОВОЙ", "АКТИВНЫЙ", "СТАБИЛЬНЫЙ", "ГЛУБОКИЙ"];
        return moods[Math.floor(Math.random() * moods.length)];
    }
};
