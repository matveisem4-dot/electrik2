export const LogicCore = {
    detectIntent: (text) => {
        const t = text.toLowerCase();
        if (t.includes("нарисуй") || t.includes("картинка")) return "IMAGE";
        if (t.includes("код") || t.includes("скрипт")) return "CODE";
        return "CHAT";
    }
};
