import asyncio
import aiohttp
from flask import Flask, request
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import Update
from aiogram.fsm.storage.memory import MemoryStorage

# Данные
TOKEN = '8225785801:AAEer9ushgGTeFpOvvPJ417EzLAqU_7sr10'
FIREBASE_URL = "https://cassa-simulator-4-default-rtdb.firebaseio.com"
# Ссылка должна быть БЕЗ слэша на конце для set_webhook в коде ниже
VERCEL_URL = "https://electrik2-git-main-matveisem4-dots-projects.vercel.app"

# Инициализация бота с хранилищем в памяти
bot = Bot(token=TOKEN)
dp = Dispatcher(storage=MemoryStorage())
app = Flask(__name__)

# Состояния пользователей
user_states = {}

@dp.message(CommandStart())
@dp.message(F.text == "/start")
async def start_cmd(message: types.Message):
    await message.answer("🏦 **Sber SIM Bank**\n\nВведите номер карты (4400...):")

@dp.message(F.text.startswith("4400"))
async def card_input(message: types.Message):
    card_num = message.text.strip().replace(" ", "")
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{FIREBASE_URL}/cards/{card_num}.json") as resp:
            data = await resp.json()
            if data:
                user_states[message.from_user.id] = {"card": card_num, "step": "wait_pin"}
                await message.answer("✅ Карта найдена!\n🔒 Введите ПИН-код:")
            else:
                await message.answer("❌ Карта не найдена.")

@dp.message()
async def handle_logic(message: types.Message):
    uid = message.from_user.id
    if uid not in user_states: return
    
    state = user_states[uid]
    text = message.text.strip()

    async with aiohttp.ClientSession() as session:
        if state["step"] == "wait_pin":
            async with session.get(f"{FIREBASE_URL}/cards/{state['card']}.json") as resp:
                res = await resp.json()
                if res and str(res.get('pin')) == text:
                    user_states[uid]["step"] = "wait_amount"
                    await message.answer(f"🔓 ПИН верный!\n💰 Баланс: {res['balance']} руб.\nВведите сумму пополнения:")
                else:
                    await message.answer("❌ Неверный ПИН!")

        elif state["step"] == "wait_amount" and text.isdigit():
            amount = int(text)
            async with session.get(f"{FIREBASE_URL}/cards/{state['card']}.json") as resp:
                res = await resp.json()
                new_balance = int(res['balance']) + amount
                await session.patch(f"{FIREBASE_URL}/cards/{state['card']}.json", json={"balance": new_balance})
                await message.answer(f"✅ Успешно!\nЗачислено: {amount} руб.\nИтог: {new_balance} руб.")
                del user_states[uid]

# ГЛАВНЫЙ ОБРАБОТЧИК ДЛЯ VERCEL
@app.route('/', methods=['POST'])
async def main_webhook():
    if request.method == "POST":
        # Читаем JSON от Телеграма
        update_data = request.get_json()
        update = Update.model_validate(update_data, context={"bot": bot})
        # Обрабатываем асинхронно
        await dp.feed_update(bot, update)
        return "OK", 200
    return "Forbidden", 403

@app.route('/set_webhook')
async def set_webhook_route():
    # Принудительно ставим вебхук на корень сайта
    status = await bot.set_webhook(url=VERCEL_URL)
    return f"Webhook status: {status}"

@app.route('/')
def index():
    return "Server is working!"
