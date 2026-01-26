import asyncio
import aiohttp
from flask import Flask, request
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import Update

# Твои данные
TOKEN = '8225785801:AAEer9ushgGTeFpOvvPJ417EzLAqU_7sr10'
FIREBASE_URL = "https://cassa-simulator-4-default-rtdb.firebaseio.com"
VERCEL_URL = "https://electrik2-git-main-matveisem4-dots-projects.vercel.app"

bot = Bot(token=TOKEN)
dp = Dispatcher()
app = Flask(__name__)

user_states = {}

# 1. Всеядный старт (поймет /start, /strart и даже привет)
@dp.message(F.text.lower().regexp(r".*st.*rt.*") | (F.text.lower() == "привет"))
async def start_cmd(message: types.Message):
    await message.answer("🏦 **Sber SIM Bank**\n\nВведите номер карты (4400...):")

# 2. Обработка карты
@dp.message(F.text.startswith("4400"))
async def card_input(message: types.Message):
    card_num = message.text.strip().replace(" ", "")
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{FIREBASE_URL}/cards/{card_num}.json") as resp:
            data = await resp.json()
            if data:
                user_states[message.from_user.id] = {"card": card_num, "step": "pin"}
                await message.answer("✅ Карта найдена!\n🔒 Введите ПИН-код:")
            else:
                await message.answer("❌ Карта не найдена.")

# 3. ПИН и пополнение
@dp.message()
async def logic(message: types.Message):
    uid = message.from_user.id
    if uid not in user_states: return
    state = user_states[uid]
    text = message.text.strip()

    async with aiohttp.ClientSession() as session:
        if state["step"] == "pin":
            async with session.get(f"{FIREBASE_URL}/cards/{state['card']}.json") as resp:
                res = await resp.json()
                if res and str(res.get('pin')) == text:
                    user_states[uid]["step"] = "amount"
                    await message.answer(f"🔓 Баланс: {res['balance']} руб.\nВведите сумму пополнения:")
                else:
                    await message.answer("❌ Неверный ПИН!")
        elif state["step"] == "amount" and text.isdigit():
            async with session.get(f"{FIREBASE_URL}/cards/{state['card']}.json") as resp:
                res = await resp.json()
                new_bal = int(res['balance']) + int(text)
                await session.patch(f"{FIREBASE_URL}/cards/{state['card']}.json", json={"balance": new_bal})
                await message.answer(f"✅ Успешно!\nНовый баланс: **{new_bal} руб.**")
                del user_states[uid]

@app.route('/', methods=['POST'])
def webhook():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    update = Update.model_validate(request.json, context={"bot": bot})
    loop.run_until_complete(dp.feed_update(bot, update))
    return "OK", 200

@app.route('/set_webhook')
def set_webhook():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(bot.delete_webhook())
    s = loop.run_until_complete(bot.set_webhook(VERCEL_URL))
    return f"Webhook status: {s}"

@app.route('/')
def index():
    return "Bot is alive!"
