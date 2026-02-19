// CYBERMIND WEB-ENGINE (JS-Only AI)
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

async function bootAI() {
    const model = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-78M');
    const out = await model("Hello, who are you?", { max_new_tokens: 50 });
    console.log("AI Response:", out[0].generated_text);
}
