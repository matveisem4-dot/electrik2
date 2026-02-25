export default async function handler(req, res) {
    // Разрешаем запросы со всех доменов (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { prompt, type } = req.query;

    if (!prompt) return res.status(400).json({ error: "No prompt" });

    try {
        if (type === 'text') {
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`);
            const data = await response.text();
            return res.status(200).send(data);
        }

        const seed = Math.floor(Math.random() * 1000000);
        // Используем прямые ссылки, которые точно работают
        const model = type === 'video' ? 'video' : 'flux';
        const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?seed=${seed}&model=${model}`;
        
        return res.status(200).json({ url: url });
    } catch (e) {
        return res.status(500).json({ error: "Engine error", details: e.message });
    }
}
