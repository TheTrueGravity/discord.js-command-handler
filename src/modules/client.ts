import {
    Collection,
    Message,
    User,
    Guild,
    Role
} from 'discord.js'
import {
    ClientOptions,
    Commands,
    PermissionString
} from './interfaces'

import { config } from 'dotenv'
import discord from 'discord.js'
import { Prefix, Token } from '../errors'
import { formatMessage } from './messageHandler'
import { readJson, writeJson } from '../handlers/json'

/**
 * A custom client with a built in command handler!
 * 
 * @class Client
 */
export class Client extends discord.Client implements Client {
    private commands: Commands
    private clientOptions: ClientOptions
    
    /**
     * @param clientOptions The client options
     */
    constructor(clientOptions: ClientOptions = {
        serverJsonPath: './servers.json'
    }) {
        super(clientOptions.discordClientOptions)
        this.clientOptions = clientOptions
        if (clientOptions.dotenv) config()
        if (clientOptions.dotenv == true) {
            this.clientOptions.clientToken = process.env.TOKEN
            this.clientOptions.defaultPrefix = process.env.DEFAULT_PREFIX
        } else if (typeof clientOptions.dotenv === 'object') {
            if (clientOptions.dotenv.prefix) {
                this.clientOptions.clientToken = process.env.TOKEN
            } else if (clientOptions.dotenv.token) {
                this.clientOptions.defaultPrefix = process.env.DEFAULT_PREFIX
            }
        }

        if (!this.clientOptions.defaultPrefix) throw Prefix

        this.on('message', this.handleMessage)

        this.on('ready', () => {
            console.log()
            console.log('Logged in as:      ', this.user.username)
            console.log('Client ID:         ', this.user.id)
            console.log('-------------------------------------------')
        })

        this.commands.aliases = new Collection()
        this.commands.commands = new Collection()
        this.commands.categories = new Collection()
        
        if (clientOptions.autoLogin) {
            if (!clientOptions.clientToken) throw Token
            this._login(clientOptions.clientToken)
        }
    }

    /**
     * 
     * @param token The Discord bot API token
     * @returns The Discord bot API token
     */
    public async _login(token?: string): Promise<string> {
        try {
            if (!token) {
                if (!this.clientOptions.clientToken) throw Token
                this.login(this.clientOptions.clientToken)
                return this.clientOptions.clientToken
            }
            this.login(token)
            return token
        } catch (error) {
            throw Token
        }
    }

    private async handleNewServer(guild: Guild) {
        const servers = readJson(this.clientOptions.serverJsonPath)

        servers[guild.id.toString()] = {}
        servers[guild.id.toString()]["prefix"] = this.clientOptions.defaultPrefix

        await writeJson('./servers.json', servers)
    }
    
    private async handleMessage(message: Message) {
        const servers = await readJson(this.clientOptions.serverJsonPath)
        if (servers[message.guild.id] == undefined) {
            await this.handleNewServer(message.guild)
        }
        const msg = await formatMessage(message.content, servers[message.guild.id]['prefix'])
        if (!msg) return
        const {
            command,
            args,
            rawArgs
        } = msg

        var cmd = this.commands.commands.get(command)

        if (!cmd) {
            this.commands.aliases.get(command).forEach(element => {
                if (this.commands.commands.get(element)) {
                    cmd = this.commands.commands.get(element)
                }
            })
        }

        if (!cmd) return message.reply('Invalid command!')

        if (cmd.requiredPerms) {
            if (cmd.requiredPerms == 'mod') {
                if (!this.isMod(message.author, message.guild)) return
            } else if (cmd.requiredPerms == 'admin') {
                if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) return
            } else if (cmd.requiredPerms == 'owner') {
                if (!message.guild.member(message.author).hasPermission(null, { checkOwner: true })) return
            } else if (typeof cmd.requiredPerms === 'object') {
                cmd.requiredPerms.forEach((requiredPerm) => {
                    if (!message.guild.member(message.author).hasPermission(requiredPerm)) return
                })
            } else {
                if (!message.guild.member(message.author).hasPermission(cmd.requiredPerms)) return
            }
        }

        if (!(await cmd.run(this, message, args, rawArgs))) {
            message.reply('there was an error executing that command!')
        }
    }

    private async isMod(user: User, guild: Guild): Promise<boolean> {
        var isMod = false
        const perms = ['BAN_MEMBERS', 'DEAFEN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_EMOJIS',
        'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS' ]
        
        perms.forEach((permission: PermissionString) => {
            if (guild.member(user).hasPermission(permission)) isMod = true;
        })
        return isMod
    }
}