export const LogicCore = {
    analyze: (text) => {
        const complexity = text.length > 20 ? "ВЫСОКАЯ" : "НИЗКАЯ";
        return { complexity, score: Math.random().toFixed(2) };
    }
};
