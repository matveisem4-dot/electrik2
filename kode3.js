export const MemoryCore = {
    vault: new Map(),
    
    store(id, data) {
        const timestamp = performance.now();
        this.vault.set(id, { data, timestamp, integrity: Math.random().toFixed(4) });
    },

    getSnapshot() {
        return Array.from(this.vault.values()).slice(-1)[0];
    }
};
