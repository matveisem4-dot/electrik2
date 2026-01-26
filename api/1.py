import asyncio
import aiohttp
from flask import Flask, request
from aiogram import Bot, Dispatcher, types
from aiogram.types import Update

# Данные
TOKEN = '8225785801:AAEer9ushgGTeFpOvvPJ417EzLAqU_7sr10'
FIREBASE_URL = "https://cassa-simulator-4-default-rtdb.firebaseio.com"
VERCEL_URL = "https://electrik2-git-main-matveisem4-dots-projects.vercel.app"

bot = Bot(token=TOKEN)
dp = Dispatcher()
app = Flask(__name__)

user_states = {}

# Реагируем на ВСЁ, чтобы проверить связь
@dp.message()
async def global_handler(message: types.Message):
    text = message.text.strip()
    uid = message.from_user.id
    
    if text == "/start":
        await message.answer("🏦 **Sber SIM Bank подключен!**\nВведите номер карты:")
        return

    if text.startswith("4400"):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{FIREBASE_URL}/cards/{text}.json") as resp:
                data = await resp.json()
                if data:
                    user_states[uid] = {"card": text, "step": "wait_pin"}
                    await message.answer("✅ Карта найдена! Введите ПИН:")
                else:
                    await message.answer("❌ Карта не найдена.")
        return

    # Логика ПИН-кода и суммы (если пользователь уже в процессе)
    if uid in user_states:
        state = user_states[uid]
        if state["step"] == "wait_pin":
            # Тут проверка пина...
            await message.answer(f"Вы ввели ПИН: {text}. Проверяю...")
            # (добавь логику из прошлого кода по аналогии)

@app.route('/', methods=['POST'])
async def main_webhook():
    # Печатаем в логи ВЕРСЕЛЯ, что запрос пришел
    print("!!! ПОЛУЧЕН ЗАПРОС ОТ TELEGRAM !!!")
    update_data = request.get_json()
    update = Update.model_validate(update_data, context={"bot": bot})
    await dp.feed_update(bot, update)
    return "OK", 200

@app.route('/set_webhook')
async def set_webhook_route():
    # Важно: удаляем старый и ставим новый
    await bot.delete_webhook()
    status = await bot.set_webhook(url=VERCEL_URL)
    return f"Webhook status: {status}"

@app.route('/')
def index():
    return "Server is working!"
