import { LogicCore } from './kode.js';
import { CreativeCore } from './kode2.js';
import { MemoryCore } from './memory.js'; // Убедись, что имя файла совпадает

export const SuperBrain = {
    async compute(request) {
        // Шаг 1: Квантовый анализ
        const analysis = LogicCore.analyze(request);
        
        // Шаг 2: Определение вектора действия
        const tokens = request.toLowerCase();
        let result = { type: 'text', data: '' };

        if (tokens.includes("нарисуй") || tokens.includes("визуал")) {
            result.data = await CreativeCore.manifestImage(request);
            result.type = 'image';
        } else if (tokens.includes("код") || tokens.includes("скрипт")) {
            result.data = CreativeCore.generateQuantumCode(request);
            result.type = 'code';
        } else {
            result.data = `Квантовый анализ завершен. Состояние когерентности: ${analysis.coherence.toFixed(4)}. Система Aeterna-1234 готова к выполнению директив.`;
            result.type = 'text';
        }

        MemoryCore.store(Date.now(), result.data);
        return { ...result, analysis };
    }
};
