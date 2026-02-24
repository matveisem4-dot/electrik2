export default async function handler(req, res) {
    // Разрешаем только POST запросы от нашего сайта
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    try {
        // Подключаемся к мощной модели Mixtral (бесплатный шлюз Hugging Face)
        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputs: `<s>[INST] Ты NeuroEngine X, проект Monolith. Отвечай только на русском языке. Будь краток и точен. Запрос: ${prompt} [/INST]`,
                    parameters: { 
                        max_new_tokens: 800, 
                        temperature: 0.7,
                        return_full_text: false 
                    }
                }),
            }
        );

        const result = await response.json();
        
        // Извлекаем чистый текст ответа
        let aiText = "";
        if (Array.isArray(result) && result[0]?.generated_text) {
            aiText = result[0].generated_text;
            // Если модель вернула запрос вместе с ответом, отрезаем его
            if (aiText.includes('[/INST]')) {
                aiText = aiText.split('[/INST]').pop().trim();
            }
        } else {
            aiText = "Мозг сервера сейчас перегружен. Попробуй отправить запрос еще раз.";
        }

        res.status(200).json({ text: aiText });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Критическая ошибка нейронного узла." });
    }
}
