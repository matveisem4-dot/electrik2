import asyncio
import aiohttp
from flask import Flask, request
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import Update

TOKEN = '8225785801:AAEer9ushgGTeFpOvvPJ417EzLAqU_7sr10'
FIREBASE_URL = "https://cassa-simulator-4-default-rtdb.firebaseio.com"
VERCEL_URL = "https://electrik2-git-main-matveisem4-dots-projects.vercel.app"

bot = Bot(token=TOKEN)
dp = Dispatcher()
app = Flask(__name__)

@dp.message(F.text == "/start")
async def start_cmd(message: types.Message):
    await message.answer("🏦 **Sber SIM Bank**\n\nБот активен! Введите номер карты:")

@dp.message(F.text.startswith("4400"))
async def card_input(message: types.Message):
    card_num = message.text.strip().replace(" ", "")
    # Используем асинхронный запрос, чтобы Vercel не тормозил
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{FIREBASE_URL}/cards/{card_num}.json") as resp:
            data = await resp.json()
            if data:
                await message.answer(f"✅ Карта найдена!\n💰 Баланс: {data['balance']} руб.\nВведите ПИН:")
            else:
                await message.answer("❌ Карта не найдена в базе.")

@app.route('/', methods=['POST'])
async def webhook():
    # Эта часть отвечает за прием сообщений от Telegram
    update = Update.model_validate(request.json, context={"bot": bot})
    await dp.feed_update(bot, update)
    return "OK", 200

@app.route('/set_webhook')
async def set_webhook():
    s = await bot.set_webhook(VERCEL_URL)
    return f"Webhook set: {s}"

@app.route('/')
def index():
    return "Bot is alive!"
