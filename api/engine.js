export default async function handler(req, res) {
    // Разрешаем видео и фото проходить без блокировок
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { prompt, type } = req.query;
    if (!prompt) return res.status(400).send("No prompt provided");

    try {
        if (type === 'text') {
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`);
            const data = await response.text();
            return res.status(200).send(data);
        }

        // Для картинок и видео создаем прямую ссылку через наш движок
        const seed = Math.floor(Math.random() * 999999);
        const model = type === 'video' ? 'video' : 'flux';
        const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?seed=${seed}&model=${model}`;
        
        return res.status(200).json({ url: url });
    } catch (e) {
        return res.status(500).send("Engine Error");
    }
}
