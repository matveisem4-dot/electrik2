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

# Обработчик старта (ловит любые варианты приветствия)
@dp.message(F.text.lower().regexp(r".*st.*rt.*") | (F.text.lower().contains("привет")))
async def start_cmd(message: types.Message):
    try:
        await message.answer("🏦 **Sber SIM Bank**\nСистема активна.\nВведите номер карты (4400...):")
    except Exception as e:
        print(f"Ошибка отправки: {e}")

# Обработчик карты
@dp.message(F.text.startswith("4400"))
async def card_input(message: types.Message):
    card_num = message.text.strip().replace(" ", "")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{FIREBASE_URL}/cards/{card_num}.json") as resp:
                data = await resp.json()
                if data:
                    user_states[message.from_user.id] = {"card": card_num, "step": "pin"}
                    await message.answer("✅ Карта найдена!\nВведите ПИН-код:")
                else:
                    await message.answer("❌ Карта не найдена.")
    except Exception as e:
        await message.answer(f"⚠️ Ошибка базы данных: {e}")

# Логика ПИН-кода и пополнения
@dp.message()
async def logic(message: types.Message):
    uid = message.from_user.id
    if uid not in user_states: return
    
    try:
        state = user_states[uid]
        text = message.text.strip()
        
        async with aiohttp.ClientSession() as session:
            if state["step"] == "pin":
                async with session.get(f"{FIREBASE_URL}/cards/{state['card']}.json") as resp:
                    res = await resp.json()
                    if res and str(res.get('pin')) == text:
                        user_states[uid]["step"] = "amount"
                        await message.answer(f"🔓 Баланс: {res['balance']} руб.\nВведите сумму:")
                    else:
                        await message.answer("❌ Неверный ПИН!")
            
            elif state["step"] == "amount" and text.isdigit():
                async with session.get(f"{FIREBASE_URL}/cards/{state['card']}.json") as resp:
                    res = await resp.json()
                    new_bal = int(res['balance']) + int(text)
                    await session.patch(f"{FIREBASE_URL}/cards/{state['card']}.json", json={"balance": new_bal})
                    await message.answer(f"✅ Успешно! Новый баланс: {new_bal} руб.")
                    del user_states[uid]
    except Exception as e:
        print(f"Ошибка логики: {e}")

@app.route('/', methods=['POST'])
def webhook():
    if request.method == 'POST':
        # Создаем новый цикл событий для каждого запроса — это критично для Vercel
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            update = Update.model_validate(request.json, context={"bot": bot})
            loop.run_until_complete(dp.feed_update(bot, update))
            return "OK", 200
        except Exception as e:
            print(f"CRITICAL ERROR: {e}")
            return "Error", 500
    return "OK", 200

@app.route('/set_webhook')
def set_webhook():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(bot.delete_webhook())
        s = loop.run_until_complete(bot.set_webhook(VERCEL_URL))
        return f"Webhook set: {s}"
    except Exception as e:
        return f"Error setting webhook: {e}"

@app.route('/')
def index():
    return "Bot is alive!"
