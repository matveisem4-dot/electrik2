export default async function handler(req, res) {
    const { prompt, type } = req.query;
    if (!prompt) return res.status(400).send("No prompt");

    try {
        if (type === 'text') {
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`);
            const data = await response.text();
            return res.status(200).send(data);
        }

        const seed = Math.floor(Math.random() * 999999);
        const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?seed=${seed}&model=${type === 'video' ? 'video' : 'flux'}`;
        return res.status(200).json({ url: url });
    } catch (e) {
        return res.status(500).send("Engine Error");
    }
}
