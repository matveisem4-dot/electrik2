import { LogicCore } from './kode.js';
import { CreativeCore } from './kode2.js';
import { KnowledgeCore } from './kode3.js';

export const SuperBrain = {
    think: (userInput) => {
        const L = LogicCore.analyze(userInput);
        const C = CreativeCore.getMood();
        const K = KnowledgeCore.process(userInput);

        return `[РЕЗУЛЬТАТ]: Логика (${L.complexity}), Настроение (${C}), Слов обработано: ${K.wordCount}. Система 1234 готова!`;
    }
};
