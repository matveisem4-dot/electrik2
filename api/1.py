import asyncio
from flask import Flask, request
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import Update
import aiohttp

# Твои настройки
TOKEN = '8225785801:AAEer9ushgGTeFpOvvPJ417EzLAqU_7sr10'
VERCEL_URL = "https://electrik2-git-main-matveisem4-dots-projects.vercel.app"

bot = Bot(token=TOKEN)
dp = Dispatcher()
app = Flask(__name__)

@dp.message(F.text == "/start")
async def start_cmd(message: types.Message):
    await message.answer("🏦 **Бот запущен!**\nВведите номер карты:")

@dp.message()
async def echo_all(message: types.Message):
    # Пока просто отвечаем на любое сообщение, чтобы проверить связь
    await message.answer(f"Вы написали: {message.text}. Ищу в базе...")

@app.route('/', methods=['POST'])
def webhook():
    # Используем асинхронный запуск для Vercel
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    update = Update.model_validate(request.json, context={"bot": bot})
    loop.run_until_complete(dp.feed_update(bot, update))
    return "OK", 200

@app.route('/set_webhook')
def set_webhook():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    s = loop.run_until_complete(bot.set_webhook(VERCEL_URL))
    return f"Webhook status: {s}"

@app.route('/')
def home():
    return "Bot is alive!"
