import {
    Client
} from './modules/client'

import {
    config
} from 'dotenv'
config()

const client = new Client({
    autoLogin: true,
    dotenv: true
})