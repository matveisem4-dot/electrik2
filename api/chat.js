export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST ONLY' });
  const { prompt } = req.body;

  // Список моделей: если первая занята, идем ко второй
  const models = [
    "mistralai/Mistral-7B-Instruct-v0.2",
    "HuggingFaceH4/zephyr-7b-beta",
    "google/gemma-1.1-7b-it"
  ];

  for (const model of models) {
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: `<s>[INST] Ты NeuroEngine X. Отвечай кратко на русском. Вопрос: ${prompt} [/INST]`,
          parameters: { max_new_tokens: 500 }
        }),
      });

      const result = await response.json();
      
      // Если модель ответила текстом, а не ошибкой
      if (Array.isArray(result) && result[0]?.generated_text) {
        let text = result[0].generated_text.split('[/INST]').pop().trim();
        return res.status(200).json({ text });
      }
      
      console.log(`Модель ${model} занята, пробую следующую...`);
    } catch (e) {
      continue; // Пробуем следующую модель в списке
    }
  }

  // Если вообще никто не ответил
  res.status(200).json({ text: "Все нейроны сейчас заняты. Напиши еще раз через 10 секунд — какой-то из них точно освободится!" });
}
