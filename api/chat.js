export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  
  const { prompt } = req.body;

  try {
    // Используем мощную модель Mixtral, она реже "молчит"
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: `<s>[INST] Ты NeuroEngine X. Отвечай только на русском. Запрос: ${prompt} [/INST]`,
          parameters: { max_new_tokens: 500, temperature: 0.7 }
        }),
      }
    );

    const result = await response.json();
    let text = result[0]?.generated_text || "";
    
    // Очистка ответа от системного мусора
    if (text.includes('[/INST]')) {
      text = text.split('[/INST]').pop().trim();
    }

    res.status(200).json({ text: text || "Мозг на сервере задумался, попробуй еще раз." });
  } catch (e) {
    res.status(500).json({ text: "Критический сбой серверного узла." });
  }
}
