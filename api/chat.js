export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Нужен POST запрос' });
  
  const { prompt } = req.body;

  try {
    // Используем другую модель (Google Gemma), она сейчас самая стабильная
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-1.1-7b-it",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: `Отвечай кратко на русском. Пользователь: ${prompt}`,
          parameters: { max_new_tokens: 500 }
        }),
      }
    );

    const result = await response.json();
    
    // Если API Hugging Face тупит, выводим это
    if (result.error) {
       return res.status(200).json({ text: "Мозги сервера на техобслуживании. Попробуй через минуту." });
    }

    const text = result[0]?.generated_text || "Сервер не вернул текст.";
    res.status(200).json({ text });

  } catch (e) {
    res.status(500).json({ text: "Ошибка на стороне Vercel: " + e.message });
  }
}
