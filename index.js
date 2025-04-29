require('dotenv').config();
const token = process.env.BOT_TOKEN
const TelegramBot = require('node-telegram-bot-api');
const { ROOT, PUPIL, ADM, ADM_INLINE, KURATOR_KNOPKA, UCHENIK_PROJ, ADMIN_SUB, ADMIN_AGR, REG, REMOVE_KBT, KURATOR_DIR } = require('./botton');
const { AUTH } = require('./auth');
const { ADMIN_IDS } = require('./conf');
const { FIND_USER, USER_ADD, FIND_STATUS, FIND_DIRECT, FIND_USER_INFO, CREATE_PROJECT, PRJ_ID_INSERT, FIND_PUPIL_PRJ_IDS, FIND_PRJ_INFO } = require('./dbs_use');
const { REG_BUTTONS, KURATORS_BUTTON, KURATOR_ACCEPT_BUTTONS, MY_PROJ_BUTTONS } = require('./din_buttons');
const { HASH_GEN } = require('./helpers');
const bot = new TelegramBot(token, { polling: true });
let state = {};
let info = {};
let proj_info = {};

async function ADM_AGR(id) {
  let i = 0
  while (i < ADMIN_IDS.length) {
    let chid = ADMIN_IDS[i];
    await bot.sendMessage(chid, id, ADMIN_AGR).then(async r => {
      await bot.sendMessage(id, 'Ваш id отправлен администратору, ожидайте авторизации.')
    })
    i++;
  }
}

try {
  bot.on('message', async msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const f_name = msg.from.first_name
    const status = await FIND_STATUS(chatId)
    const reg_status = await FIND_USER(chatId);
    if (!reg_status) {
      if (!state[chatId]) {
        await bot.sendMessage(chatId, 'Здравствуйте, для доступа к боту пожалуйста пройдите регистрацию, выберите вашу роль', ROOT)
          .then(m => {
            last_message = m.message_id
          })
        state[chatId] = 'role'
      } else if (state[chatId] == 'role') {
        await bot.sendMessage(chatId, `Ваша роль ${text}`, { reply_markup: REMOVE_KBT })
        info[chatId] = {}
        info[chatId].t_id = chatId
        info[chatId].role = text
        state[chatId] = 'fio'
        await bot.sendMessage(chatId, 'Пожалуйста введите ваше ФИО\nНапример (Иванов Иван Иванович)')
      } else if (state[chatId] == 'fio') {
        if (info[chatId].role == 'Куратор') {
          state[chatId] = 'direction'
          info[chatId].fio = text
          await bot.sendMessage(chatId, `Пожалуйста выберите профиль:`, KURATOR_DIR)
        } else if (info[chatId].role == 'Ученик') {
          state[chatId] = 'klass'
          await bot.sendMessage(chatId, 'Пожалуйста введите ваш класс ')
          info[chatId].fio = text
        }
      } else if (state[chatId] == 'klass') {
        info[chatId].klass = text;
        state[chatId] = 'ok'
        await bot.sendMessage(chatId, `Проверьте ваши данные: \nФИО: ${info[chatId].fio}\nВаш класс: ${info[chatId].klass}\nВаша роль: ${info[chatId].role}`, {
          parse_mode: 'MarkdownV2',
          reply_markup: REG_BUTTONS(chatId)
        })
      } else if (state[chatId] == 'direction') {
        await bot.sendMessage(chatId, `Ваш профиль ${text}`, { reply_markup: REMOVE_KBT })
        info[chatId].direct = text
        state[chatId] = 'discription'
        await bot.sendMessage(chatId, 'Пожалуйста кратко перечислите ваши компетенции:')
      } else if (state[chatId] == 'discription') {
        info[chatId].discr = text
        state[chatId] = 'ok'
        await bot.sendMessage(chatId, `Проверьте ваши данные: \nФИО: ${info[chatId].fio}\nВаша роль: ${info[chatId].role}`, {
          parse_mode: 'MarkdownV2',
          reply_markup: REG_BUTTONS(chatId)
        })
      }
    } else {
      if (status == 'Ученик') {
        if (msg.text == '/start') {
          await bot.sendMessage(chatId, 'Добро пожаловать в бот!', PUPIL)
        } else if (text == 'Новый проект') {
          state[chatId] = 'new_prj'
          proj_info[chatId] = {};
          proj_info[chatId].creator = chatId
          await bot.sendMessage(chatId, 'Введите, пожалуйста название вашего проекта', {reply_markup: REMOVE_KBT})
        } else if (text == 'Главное меню') {
          await bot.sendMessage(chatId, 'Главное меню', PUPIL)
        } else if (state[chatId] == 'new_prj') {
            proj_info[chatId].name = text
            await bot.sendMessage(chatId, 'Введите пожалуйста краткое описание Вашего проекта.')
            state[chatId] = 'discr_prj'
        }else if (state[chatId] == 'discr_prj') {
          proj_info[chatId].discr = text
          await bot.sendMessage(chatId,'Выберите пожалуйста профиль вашего проекта', KURATOR_DIR)
          state[chatId] = 'dir_prj'
        } else if (state[chatId] == 'dir_prj') {
          proj_info[chatId].profile = text
          if (text == 'Гуманитарный') {
            await bot.sendMessage(chatId, 'Гуманитарный профиль',{reply_markup: REMOVE_KBT})
            await bot.sendMessage(chatId,`Выберите куратора проекта:`,{reply_markup: await KURATORS_BUTTON(text)})
          } else if (text == 'Технический') {
            await bot.sendMessage(chatId, 'Технический профиль',{reply_markup: REMOVE_KBT})
            await bot.sendMessage(chatId,`Выберите куратора проекта:`,{reply_markup: await KURATORS_BUTTON(text)})
          }
          state[chatId] = 'kur_prj'
          
        }else if (text == 'Мои проекты') {
          await bot.sendMessage(chatId,'Ваши проекты',{reply_markup: await MY_PROJ_BUTTONS(chatId)})
        }

      }
      else if (status == 'Куратор') {
        if (msg.text == '/start') {
          await bot.sendMessage(chatId, 'Добро пожаловать в бот!', KURATOR_KNOPKA)
        }
      }
    }



    if (text == 'Администратор') {
      const auth = AUTH(chatId)
      if (auth == true) {
        bot.sendMessage(chatId, 'Добро пожаловать в раздел Админисратора', ADMIN_SUB)
      } else {
        bot.sendMessage(chatId, `Извините ${f_name} у вас нет доступа в этот раздел`, ADM)
      }
    }
    if (text == 'Стать администратором') {
      bot.sendMessage(chatId, `Отправьте  пожалуйста ваш ID: ${chatId} администратору бота`, ADM_INLINE)
    }


  })


  bot.on('callback_query', async msg => {
    // console.log(msg)
    const chid = msg.from.id;
    const data = msg.data;
    if (data == 'query_adm') {
      const adm_agr = ADM_AGR(chid)
    } else if (state[chid] == 'ok') {
      const inf = info[chid]
      const user_add = USER_ADD(inf)
      if (user_add) {
        let btn;
        if (info[chid].role == 'Ученик') {
          btn = PUPIL
        } else if (info[chid].role == 'Куратор') {
          btn = KURATOR_KNOPKA
        }
        delete state[chid]
        delete info[chid]
        // console.log(btn)
        await bot.sendMessage(chid, 'Регистрация успешна', btn)
      } else {
        await bot.sendMessage(chid, 'Ошибка базы данных, попробуйте позже')
      }
    } else if (state[chid] == 'kur_prj') {
      const kurator_info = await FIND_USER_INFO(data)
      await bot.sendMessage(chid, `Куратор:\nФИО: ${kurator_info.fio}\nПрофиль: ${kurator_info.direct}\nКомпетенции: ${kurator_info.discr}`,{
        reply_markup: await KURATOR_ACCEPT_BUTTONS(kurator_info.t_id),
        // parse_mode: 'MarkdownV2'
      })
      state[chid] = 'agr_kurator'
    } else if (state[chid] == 'agr_kurator') {
      if (data.slice(0,5) == 'k_acc') {
        proj_info[chid].id = await HASH_GEN()
        proj_info[chid].curator = data.slice(5)
        const create_proj = await CREATE_PROJECT(proj_info[chid])
        const pr_id_insert = await PRJ_ID_INSERT(proj_info[chid])
        if (create_proj !== false && pr_id_insert !== false)  {
          await bot.sendMessage(chid, 'Проект Успешно создан')
          delete state[chid]
          delete info[chid]
        } else {
          await bot.sendMessage(chid, 'Извините! Проект создать не удалось, попробуйте позже или обратитесь в службу поддержки.')
        }


      } else if(data == 'k_cncl') {
        await bot.sendMessage(chid,`Выберите куратора проекта:`,{reply_markup: await KURATORS_BUTTON(proj_info[chid].profile)})
        state[chid] = 'kur_prj'

        // console.log(proj_info)
      }
    }else if (data.slice(0,4) == 'pr_i') {
      const pr_i = await FIND_PRJ_INFO(data.slice(4))
      await bot.sendMessage(chid,`Название проекта: ${pr_i.name}\nОписание проекта: ${pr_i.discr}`)
    }

    bot.answerCallbackQuery(msg.id);
  })
} catch (err) {
  console.error('err')
}
