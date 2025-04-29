const mongo = require('mongoose');
const { DB_URI } = require('./conf');
require('./models');
const user_model = mongo.model('users');
const proj_model = mongo.model('projects');

async function USER_PRJ_IDS (t_id) {
    try {
        await mongo.connect(DB_URI)
        const res = await user_model.findOne({t_id: t_id})
        return res.projects
    }catch (err) {
        console.error(err)
        await mongo.disconnect()
        return false
    }
}

module.exports = {
    async FIND_USER(t_id) {
        await mongo.connect(DB_URI);
        const res = await user_model.findOne({ t_id: t_id });
        await mongo.disconnect();
        return res;
    },

    async USER_ADD(info) {
        try {
            let klass;
            if (info.klass) {
                klass = info.klass
            } else {
                klass = 'no'
            }
            const user_add = new user_model({
                t_id: info.t_id,
                fio: info.fio,
                role: info.role,
                klass: klass,
                direct: info.direct,
                discr: info.discr,
            })
            await mongo.connect(DB_URI)
            await user_add.save()
            await mongo.disconnect()
            return true
        } catch (err) {
            await mongo.disconnect()
            console.error(err)
            return false

        }
    },
    async FIND_STATUS(t_id) {
        try {
            await mongo.connect(DB_URI)
            const status = await user_model.findOne({ t_id: t_id })
            await mongo.disconnect()
            return status.role
        }
        catch (err) {
            console.error(err)
            await mongo.disconnect()
            return 'err'
        }
    },

    async FIND_DIRECT (direct) {
        try{
            await mongo.connect(DB_URI)
            const res = await user_model.find({direct: direct})
            const result = res.map((e)=>`${e.fio}`)
            return result
            // (result.join('\n-----------\n'))
        }catch (err) {
            console.error(err)
            await mongo.disconnect()
            return 'err'
        }
    },

    async FIND_USER_INFO (fio) {
        try {
            await mongo.connect(DB_URI)
            const res = await user_model.findOne({fio: fio})
            await mongo.disconnect()
            return res
        }catch (err) {
            console.error(err)
            await mongo.disconnect()
            return 'err'
        }
    },
    async CREATE_PROJECT (pr_inf) {
        try{
            const proj_add = new proj_model ({
                id: pr_inf.id,
                name: pr_inf.name,
                creator: pr_inf.creator,
                curator: pr_inf.curator,
                profile: pr_inf.profile,
                discr: pr_inf.discr,
            })
            await mongo.connect(DB_URI)
            await proj_add.save()
            await mongo.disconnect()
            return true

        }catch (err) {
            console.error(err)
            await mongo.disconnect()
            return false
        }
    },
    

    async PRJ_ID_INSERT (inf) {
        try {
            let u_prjs = await USER_PRJ_IDS(inf.creator)
            u_prjs.push(inf.id)
            await mongo.connect(DB_URI)
            await user_model.updateOne({t_id: inf.creator}, {
                $set: {
                    projects: u_prjs
                }
            })
            await mongo.disconnect()
            return true

        }catch (err) {
            console.error(err)
            await mongo.disconnect()
            return false
        }
    },

    async FIND_PUPIL_PRJ_IDS(t_id) {
        const res = await USER_PRJ_IDS(t_id)
        return res
    },

    async FIND_PRJ_INFO (p_id) {
        try {
            await mongo.connect(DB_URI)
            const res = await proj_model.findOne({id: p_id})
            await mongo.disconnect()
            return res
        }catch (err) {
            console.error(err)
            await mongo.disconnect()
            return 'err'
        }
    },

}