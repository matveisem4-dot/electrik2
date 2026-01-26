import asyncio
import requests
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.client.session.aiohttp import AiohttpSession

logging.basicConfig(level=logging.INFO)

# Твои данные
TOKEN = '8225785801:AAEer9ushgGTeFpOvvPJ417EzLAqU_7sr10'
FIREBASE_URL = "https://cassa-simulator-4-default-rtdb.firebaseio.com"

proxy_url = "http://proxy.server:3128"
session = AiohttpSession(proxy=proxy_url)
bot = Bot(token=TOKEN, session=session)
dp = Dispatcher()

# Здесь мы храним, на каком этапе находится пользователь
user_states = {}

@dp.message(Command("start"))
async def start_cmd(message: types.Message):
    await message.answer("🏦 **Sber SIM Bank**\n\nВведите номер карты (4400...):")

@dp.message(F.text.startswith("4400"))
async def card_input(message: types.Message):
    card_num = message.text.strip().replace(" ", "")
    res = requests.get(f"{FIREBASE_URL}/cards/{card_num}.json")
    data = res.json()

    if data:
        # Сохраняем номер карты и ставим статус "ждем_пин"
        user_states[message.from_user.id] = {"card": card_num, "step": "wait_pin"}
        await message.answer("🔒 Введите ПИН-код от этой карты:")
    else:
        await message.answer("❌ Карта не найдена в базе.")

@dp.message()
async def handle_numbers(message: types.Message):
    uid = message.from_user.id
    text = message.text.strip()

    # Проверяем, есть ли пользователь в процессе
    if uid not in user_states:
        await message.answer("Введите номер карты (4400...) для начала.")
        return

    state = user_states[uid]

    # ШАГ 2: ПРОВЕРКА ПИН-КОДА
    if state["step"] == "wait_pin":
        res = requests.get(f"{FIREBASE_URL}/cards/{state['card']}.json").json()

        if str(res['pin']) == text:
            user_states[uid]["step"] = "wait_amount" # Переходим к сумме
            await message.answer(f"✅ ПИН верный!\n💰 Баланс: {res['balance']} руб.\n\n**Напишите сумму пополнения:**")
        else:
            await message.answer("❌ Неверный ПИН-код! Попробуйте еще раз:")

    # ШАГ 3: ПОПОЛНЕНИЕ
    elif state["step"] == "wait_amount":
        if text.isdigit():
            amount = int(text)
            card_num = state["card"]

            # Запрос к базе
            res = requests.get(f"{FIREBASE_URL}/cards/{card_num}.json").json()
            new_balance = res['balance'] + amount

            # Обновляем
            requests.patch(f"{FIREBASE_URL}/cards/{card_num}.json", json={"balance": new_balance})

            await message.answer(f"💰 **Успешно!**\nЗачислено: {amount} руб.\nНовый баланс: **{new_balance} руб.**")

            # Сбрасываем состояние, чтобы можно было начать заново
            del user_states[uid]
        else:
            await message.answer("Пожалуйста, введите сумму числом.")

async def main():
    print("🚀 Бот запущен и готов к работе!")
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())
