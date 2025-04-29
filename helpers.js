const {createHmac} = require('node:crypto')
module.exports = {
    async HASH_GEN () {
        const date = new Date()
        const hash = createHmac('sha256', String(date))
            .update('kjdfhglkshdlg')
            .digest('hex');
        return(`${hash.slice(-15)}`)
    }
}