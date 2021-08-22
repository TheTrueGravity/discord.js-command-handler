import {
    Collection,
    Message,
    Role
} from 'discord.js'
import { Client } from './client'

import discord from 'discord.js'

/**
 * The command interface used for ALL commands!
 */
 export interface Command {
    /**
     * The command name!
     * @member {string} name
     */
    name: string
    category: string
    description: string
    run(client: Client, message: Message, args: Array<string>, rawArgs: string): Promise<boolean>
    aliases?: Array<string>
    requiredPerms?: Array<PermissionString> | PermissionString | 'mod' | 'admin' | 'owner'
    requiresSpecialRoles?: Array<string | Role> | string
}

export interface Category {

}

export interface Commands {
    commands: Collection<string, Command>
    aliases: Collection<string, string[]>
    categories: Collection<string, Category>
}

/**
 * The client options!
 * 
 * @interface ClientOptions
 * 
 * @member {boolean} autoLogin
 * 
 * The client token required to log into discord.js automatically!
 * 
 * @member {discord.ClientOptions} discordClientOptions
 * 
 * The client token required to log into discord.js automatically!
 */
export interface ClientOptions {
    /**
     * Set weather or not the client should automatically log in!
     * @param autoLogin
     */
    autoLogin?: boolean
    /**
     * The client token required to log into discord.js automatically!
     * @param clientToken
     */
    clientToken?: string
    /**
     * The path to the server json file!
     * @param serverJsonPath
     */
    serverJsonPath?: string
    /**
     * 
     */
    defaultPrefix?: string
    /**
     * Choose weather you want to get the discord bot token and prefix from process.env
     * 
     * Asign token as TOKEN
     * Asign prefix as DEFAULT_PREFIX
     * @param dotenv
     */
    dotenv?: boolean | {
        token: boolean
        prefix: boolean
    }
    /**
     * Set weather or not the client should automatically log in!
     * @param discordClientOptions
     */
    discordClientOptions?: discord.ClientOptions
}

export interface formattedMessage {
    command: string,
    args: string[]
    rawArgs: string
}

export type PermissionString =
    | 'CREATE_INSTANT_INVITE'
    | 'KICK_MEMBERS'
    | 'BAN_MEMBERS'
    | 'ADMINISTRATOR'
    | 'MANAGE_CHANNELS'
    | 'MANAGE_GUILD'
    | 'ADD_REACTIONS'
    | 'VIEW_AUDIT_LOG'
    | 'PRIORITY_SPEAKER'
    | 'STREAM'
    | 'VIEW_CHANNEL'
    | 'SEND_MESSAGES'
    | 'SEND_TTS_MESSAGES'
    | 'MANAGE_MESSAGES'
    | 'EMBED_LINKS'
    | 'ATTACH_FILES'
    | 'READ_MESSAGE_HISTORY'
    | 'MENTION_EVERYONE'
    | 'USE_EXTERNAL_EMOJIS'
    | 'VIEW_GUILD_INSIGHTS'
    | 'CONNECT'
    | 'SPEAK'
    | 'MUTE_MEMBERS'
    | 'DEAFEN_MEMBERS'
    | 'MOVE_MEMBERS'
    | 'USE_VAD'
    | 'CHANGE_NICKNAME'
    | 'MANAGE_NICKNAMES'
    | 'MANAGE_ROLES'
    | 'MANAGE_WEBHOOKS'
    | 'MANAGE_EMOJIS'