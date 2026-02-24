export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    try {
        // Мы используем публичный шлюз к нейросети. Она работает на серверах, а не у тебя.
        const response = await fetch(
            "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
                    Ты — NeuroEngine X, проект Monolith. Отвечай всегда на русском языке. 
                    Твой пароль доступа — 1234. Выдавай полные блоки кода по запросу.<|eot_id|>
                    <|start_header_id|>user<|end_header_id|>${prompt}<|eot_id|>
                    <|start_header_id|>assistant<|end_header_id|>`,
                    parameters: { max_new_tokens: 500, temperature: 0.7 }
                }),
            }
        );

        const result = await response.json();
        
        // Очищаем текст от системных тегов
        let aiText = result[0]?.generated_text || "Система занята...";
        aiText = aiText.split('<|start_header_id|>assistant<|end_header_id|>').pop().trim();

        res.status(200).json({ text: aiText });
    } catch (error) {
        res.status(500).json({ error: "Ошибка серверного узла Монолита" });
    }
}
