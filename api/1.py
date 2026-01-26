import asyncio
import aiohttp
from flask import Flask, request
from aiogram import Bot, Dispatcher, types
from aiogram.types import Update

# Твои токены
TOKEN = '8225785801:AAEer9ushgGTeFpOvvPJ417EzLAqU_7sr10'
FIREBASE_URL = "https://cassa-simulator-4-default-rtdb.firebaseio.com"
VERCEL_URL = "https://electrik2-git-main-matveisem4-dots-projects.vercel.app"

app = Flask(__name__)
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Храним состояние в простом словаре (для тестов)
user_states = {}

@dp.message()
async def handle_all(message: types.Message):
    uid = message.from_user.id
    text = message.text.strip()

    if text == "/start":
        await message.answer("🏦 **Sber SIM Bank**\nВведите номер карты:")
        return

    # Логика ввода карты
    if text.startswith("4400"):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{FIREBASE_URL}/cards/{text}.json") as resp:
                data = await resp.json()
                if data:
                    user_states[uid] = {"card": text, "step": "pin"}
                    await message.answer("✅ Карта найдена! Введите ПИН:")
                else:
                    await message.answer("❌ Карта не найдена.")
        return

    # Логика ПИН-кода и пополнения
    if uid in user_states:
        state = user_states[uid]
        if state["step"] == "pin":
            # Тут можно добавить проверку ПИН из базы
            user_states[uid]["step"] = "amount"
            await message.answer("🔓 ПИН принят! Введите сумму пополнения:")
        elif state["step"] == "amount" and text.isdigit():
            # Тут логика PATCH в Firebase
            await message.answer(f"💰 Баланс пополнен на {text} руб!")
            del user_states[uid]

@app.route('/', methods=['POST'])
def webhook():
    # ГЛАВНОЕ ИСПРАВЛЕНИЕ: принудительный запуск цикла
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    update = Update.model_validate(request.json, context={"bot": bot})
    loop.run_until_complete(dp.feed_update(bot, update))
    return "OK", 200

@app.route('/set_webhook')
def setup():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    res = loop.run_until_complete(bot.set_webhook(VERCEL_URL))
    return f"Webhook status: {res}"

@app.route('/')
def index():
    return "Bot is running!"
