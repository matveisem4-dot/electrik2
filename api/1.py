import os
import asyncio
import requests
from flask import Flask, request
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import Update

# Данные
TOKEN = '8225785801:AAEer9ushgGTeFpOvvPJ417EzLAqU_7sr10'
FIREBASE_URL = "https://cassa-simulator-4-default-rtdb.firebaseio.com"

# Инициализация
bot = Bot(token=TOKEN)
dp = Dispatcher()
app = Flask(__name__)

user_states = {}

@dp.message(F.text == "/start")
async def start_cmd(message: types.Message):
    await message.answer("🏦 **Sber SIM Bank**\n\nВведите номер карты (4400...):")

@dp.message(F.text.startswith("4400"))
async def card_input(message: types.Message):
    card_num = message.text.strip().replace(" ", "")
    res = requests.get(f"{FIREBASE_URL}/cards/{card_num}.json").json()
    if res:
        user_states[message.from_user.id] = {"card": card_num, "step": "wait_pin"}
        await message.answer("🔒 Введите ПИН-код от этой карты:")
    else:
        await message.answer("❌ Карта не найдена.")

@dp.message()
async def handle_msg(message: types.Message):
    uid = message.from_user.id
    text = message.text.strip()
    if uid not in user_states: return
    
    state = user_states[uid]
    if state["step"] == "wait_pin":
        res = requests.get(f"{FIREBASE_URL}/cards/{state['card']}.json").json()
        if str(res.get('pin')) == text:
            user_states[uid]["step"] = "wait_amount"
            await message.answer(f"✅ ПИН верный!\n💰 Баланс: {res['balance']} руб.\nНапишите сумму пополнения:")
        else:
            await message.answer("❌ Неверный ПИН!")
    
    elif state["step"] == "wait_amount" and text.isdigit():
        amount = int(text)
        res = requests.get(f"{FIREBASE_URL}/cards/{state['card']}.json")
        new_balance = res['balance'] + amount
        requests.patch(f"{FIREBASE_URL}/cards/{state['card']}.json", json={"balance": new_balance})
        await message.answer(f"💰 Зачислено: {amount} руб.\nИтог: {new_balance} руб.")
        del user_states[uid]

# Обработчик для Vercel
@app.route('/', methods=['POST'])
async def webhook():
    if request.method == "POST":
        update = Update.model_validate(request.json, context={"bot": bot})
        await dp.feed_update(bot, update)
        return "OK", 200
    return "Method not allowed", 405

@app.route('/set_webhook')
async def set_webhook():
    # Замени на свою ссылку от Vercel после деплоя!
    url = "url = "https://electrik2-git-main-matveisem4-dots-projects.vercel.app/"" 
    s = await bot.set_webhook(url)
    return "Webhook set: " + str(s)
