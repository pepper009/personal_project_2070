module.exports = {
    ROOT: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{ text: 'Куратор' },{ text: 'Ученик' }],
                // [{ text: 'Ученик' }],
                [{ text: 'Администратор' }],
            ]
        })
    },
    PUPIL: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{ text: 'Мои проекты' }],
                [{ text: 'Новый проект',}],
            ]
        })
    },
    ADM: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{ text: 'Стать администратором' }],
            ]
        })
    },
    ADM_INLINE: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Отправить ID', callback_data: 'query_adm' }],
            ]
        })
    },
    ADMIN_SUB: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{ text: 'Назначить куратора' }],
                [{text: 'Удалить куратора'}],
                [{text: 'Просмотр кураторов'}],
                [{text: 'Просмотр проектов'}],
            ]
        })

    },
    KURATOR_KNOPKA: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{ text: 'Список проектов' }],
                
            ]
        })
    },
    UCHENIK_PROJ: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{ text: 'Создать проект' }],
                [{text: 'Мои проекты'}],
                [{text: 'Главное меню'}]
            ]
        })
    }
}