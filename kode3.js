export const MemoryCore = {
    history: [],
    
    save(user, bot) {
        this.history.push({ user, bot, time: Date.now() });
        if(this.history.length > 10) this.history.shift(); // Храним 10 шагов
    },

    getContext() {
        return this.history.map(h => `User: ${h.user} | AI: ${h.bot}`).join('\n');
    }
};
