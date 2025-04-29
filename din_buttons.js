const { FIND_DIRECT, FIND_PUPIL_PRJ_IDS, FIND_PRJ_INFO } = require("./dbs_use")

module.exports = {
    REG_BUTTONS (t_id) {
        let button = {inline_keyboard:[[{text: 'Зарегистрироваться', callback_data: t_id}]]}
        return JSON.stringify(button)
    },
    async KURATORS_BUTTON (direct) {
        const kurators = await FIND_DIRECT(direct)
        let buttons = []
        let i = 0;
        while(i < kurators.length) {
            let kurator = kurators[i]
            buttons.push([{text:`${kurator}`, callback_data: `${kurator}`}])
            i++
        }
        return JSON.stringify({inline_keyboard: buttons} )
    },
    async KURATOR_ACCEPT_BUTTONS (t_id) {
        const button = 
             [
                [{text: 'Выбрать',callback_data: `k_acc${t_id}`},{text: 'Отмена', callback_data: 'k_cncl'}]
            ]
        return (JSON.stringify({inline_keyboard: button}))
    },
    async MY_PROJ_BUTTONS (t_id) {
        const prj_ids = await FIND_PUPIL_PRJ_IDS(t_id)
        let button = []
        let i = 0
        while(i < prj_ids.length) {
            let id = prj_ids[i]
            let prj_info = await FIND_PRJ_INFO(id)
            button.push([{text: prj_info.name, callback_data: `pr_i${id}`}])
            i++
        }
        return(JSON.stringify({inline_keyboard: button}))
    }

}