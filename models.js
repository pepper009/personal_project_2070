const mongo = require('mongoose')
const schema = mongo.Schema
const user_schema = new schema(
    {
        t_id: {
            type: String,
            default: 'no',
        },
        fio: {
            type: String,
            default: 'no',
        },
        rights: {
            type: String,
            default: 'user',
        },
        project: {
            type: Array,
            default: [],
        },
        klass: {
            type: String,
            default: 'no',
        }


    }
)
const project = new mongo.Schema(
    {
        id: {
            type: String,
            default: 'no'
        },
        name: {
            type: String,
            default: 'no',
        },
        curator: {
            type: String,
            default: 'no'
        },
        profile: {
            type: String,
            default: 'no',
        },
        stage: {
            type: String,
            default: 'new'
        }

    }
)
