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
        role: {
            type: String,
            default: '',
        },
        direct: {
            type: String,
            default: '',
        },
        discr: {
            type: String,
            default: '',
        },
        projects: {
            type: Array,
            default: [],
        },
        klass: {
            type: String,
            default: 'no',
        },
        ban: {
            type: String,
            default: 'no',
        },

    },
    {
        autoIndex: true,
        timestamps: true,
    }
)
const project_schema = new mongo.Schema(
    {
        id: {
            type: String,
            default: 'no'
        },
        name: {
            type: String,
            default: 'no',
        },
        creator: {
            type: String,
            default: 'no'
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
        },
        discr: {
            type: String,
            default: ''
        }

    },
    {
        autoIndex: true,
        timestamps: true,
    }
)

mongo.model('users',user_schema)
mongo.model('projects', project_schema)