// Модуль семантического ядра
export const LogicCore = {
    weights: { math: 0.8, creative: 0.5, coding: 0.9 },
    
    analyze(input) {
        const tokens = input.toLowerCase().split(' ');
        const vector = tokens.map(word => word.length / 10); // Имитация векторного веса
        
        // Определение намерения через веса
        const isCode = tokens.some(t => ['код', 'скрипт', 'функция', 'js', 'html'].includes(t));
        const isImage = tokens.some(t => ['нарисуй', 'картинка', 'фото', 'образ'].includes(t));
        
        return {
            intent: isCode ? 'GENERATION_CODE' : (isImage ? 'GENERATION_IMAGE' : 'CORE_CHAT'),
            confidence: Math.max(...vector),
            complexity: input.length > 50 ? 'DEEP_CORE' : 'FAST_CORE'
        };
    }
};
