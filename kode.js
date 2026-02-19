export const LogicCore = {
    analyze: (text) => {
        const triggers = ["привет", "как дела", "кто ты"];
        const found = triggers.some(t => text.toLowerCase().includes(t));
        return { isCommon: found, level: Math.floor(Math.random() * 100) };
    }
};
