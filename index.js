require('dotenv').config();
const token = process.env.BOT_TOKEN
const TelegramBot = require('node-telegram-bot-api');
const { ROOT, PUPIL, ADM, ADM_INLINE, KURATOR_KNOPKA, UCHENIK_PROJ, ADMIN_SUB } = require('./botton');
const { AUTH } = require('./auth');
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const f_name = msg.from.first_name
  if (msg.text == '/start') {
    bot.sendMessage(chatId, 'Выберите роль', ROOT)
  }
  if (text == 'Куратор') {
    bot.sendMessage(chatId, 'Раздел куратор', KURATOR_KNOPKA)
  }

  if (text == 'Ученик') {
    bot.sendMessage(chatId, 'Раздел Ученик', PUPIL)
  }
  if (text == 'Администратор') {
    const auth = AUTH(chatId)
    if (auth == true) {
      bot.sendMessage(chatId, 'Добро пожаловать в раздел Админисратора',ADMIN_SUB)
    } else {
      bot.sendMessage(chatId, `Извините ${f_name} у вас нет доступа в этот раздел`, ADM)
    }
  }
  if (text == 'Стать администратором') {
    bot.sendMessage(chatId, `Отправьте  пожалуйста ваш ID: ${chatId} администратору бота`, ADM_INLINE)
  }
  if (text == 'Мои проекты') {
    bot.sendMessage(chatId, 'Выберите действие', UCHENIK_PROJ)
  }

})

bot.on('callback_query', (msg) => {
  const msg_id = msg.id
  const data = msg.data

  bot.answerCallbackQuery(msg.id)
})

