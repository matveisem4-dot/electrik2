import { LogicCore } from './kode.js';
import { CreativeCore } from './kode2.js';
import { MemoryCore } from './kode3.js';

export const SuperBrain = {
    async process(input) {
        console.log("%c [BRAIN START] Активация нейронных связей...", "color: #00f2ff");
        
        // 1. Анализ смысла
        const analysis = LogicCore.analyze(input);
        
        // 2. Учет контекста из памяти
        const context = MemoryCore.getContext();
        
        let finalResponse = "";
        let type = "text";

        // 3. Логическое ветвление (Decision Tree)
        if (analysis.intent === 'GENERATION_IMAGE') {
            finalResponse = await CreativeCore.draw(input);
            type = "image";
        } 
        else if (analysis.intent === 'GENERATION_CODE') {
            finalResponse = CreativeCore.generateSmartCode(input);
            type = "code";
        } 
        else {
            // Имитация "умного" текстового ответа на основе весов
            finalResponse = `Анализ завершен. Контекст: ${analysis.complexity}. На основе ваших предыдущих запросов и текущего веса (${analysis.confidence}), я предлагаю решение: Система 1234 оптимизирована под ваш i5.`;
            type = "text";
        }

        MemoryCore.save(input, finalResponse.toString().substring(0, 50));
        return { content: finalResponse, type: type, metadata: analysis };
    }
};
