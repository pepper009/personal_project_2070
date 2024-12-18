const {ADMIN_IDS} = require('./conf')
module.exports = {
    AUTH(t_id) {
        if (ADMIN_IDS.includes(t_id)) {
            return true
        } else {
            return false
        }
    }
}