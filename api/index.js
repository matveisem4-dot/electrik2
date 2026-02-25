// Хранилище временных сигналов для звонков (в памяти сервера)
let signals = {};

export default async function handler(req, res) {
    const { prompt, type, roomId, signalData } = req.query;

    try {
        // Логика мессенджера (ИИ)
        if (type === 'text') {
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`);
            const data = await response.text();
            return res.status(200).send(data);
        }

        // Логика звонков (Сигналинг)
        if (type === 'signal_send') {
            signals[roomId] = signalData;
            return res.status(200).send("Signal Stored");
        }
        
        if (type === 'signal_get') {
            const data = signals[roomId] || null;
            return res.status(200).json({ signal: data });
        }

        // Генерация медиа
        if (type === 'image' || type === 'video') {
            const seed = Math.floor(Math.random() * 999999);
            const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?seed=${seed}&model=${type === 'video' ? 'video' : 'flux'}`;
            return res.status(200).json({ url: url });
        }
    } catch (e) {
        return res.status(500).send("Engine Error");
    }
}
