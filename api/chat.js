export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { prompt } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: `<s>[INST] Ты NeuroEngine X. Отвечай кратко на русском. Запрос: ${prompt} [/INST]`,
          parameters: { max_new_tokens: 250 }
        }),
      }
    );

    const result = await response.json();
    const text = result[0]?.generated_text.split('[/INST]').pop().trim() || "Сервер молчит...";
    
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ text: "Ошибка связи с ядром сервера." });
  }
}
