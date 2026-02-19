export const KnowledgeCore = {
    process: (text) => {
        const words = text.trim().split(/\s+/).length;
        return { wordCount: words, status: "СИНХРОНИЗИРОВАНО" };
    }
};
