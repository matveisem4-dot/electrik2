export default async function handler(req, res) {
    const { prompt, type } = req.query;

    if (!prompt) return res.status(400).json({ error: "Пустой запрос" });

    try {
        // Текстовая логика (Выполняется через скрытый шлюз)
        if (type === 'text') {
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`);
            const data = await response.text();
            return res.status(200).send(data);
        }

        // Медиа-логика (Генерация ссылок на GPU-рендеринг)
        if (type === 'image' || type === 'video') {
            const seed = Math.floor(Math.random() * 1000000);
            const model = type === 'video' ? 'video' : 'flux';
            const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?seed=${seed}&model=${model}&width=1024&height=1024`;
            return res.status(200).json({ url: url });
        }
    } catch (error) {
        return res.status(500).json({ error: "Критический сбой ядра" });
    }
}
