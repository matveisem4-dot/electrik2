export default async function handler(req, res) {
    const { prompt, type } = req.query;

    if (!prompt) return res.status(400).send("No prompt provided");

    // Твой движок сам решает, куда направлять потоки данных
    try {
        if (type === 'text') {
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai&system=Ты Monolith Engine v4. Работаешь на серверах Vercel.`);
            const data = await response.text();
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.status(200).send(data);
        }

        if (type === 'image' || type === 'video') {
            const seed = Math.floor(Math.random() * 999999);
            const model = type === 'video' ? 'video' : 'flux';
            const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?seed=${seed}&model=${model}`;
            return res.status(200).json({ url: url });
        }
    } catch (error) {
        return res.status(500).json({ error: "Engine Fault" });
    }
}
