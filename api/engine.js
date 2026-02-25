export default async function handler(req, res) {
    const { prompt, type } = req.query;

    if (!prompt) return res.status(400).send("No prompt provided");

    try {
        if (type === 'text') {
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`);
            const data = await response.text();
            return res.status(200).send(data);
        }

        // Для медиа: создаем стабильный URL
        const seed = Math.floor(Math.random() * 99999);
        const model = type === 'video' ? 'video' : 'flux';
        const mediaUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?seed=${seed}&model=${model}`;
        
        return res.status(200).json({ url: mediaUrl });
    } catch (error) {
        return res.status(500).send("Core error: " + error.message);
    }
}























































































