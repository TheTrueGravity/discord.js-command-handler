"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const discord_js_2 = __importDefault(require("discord.js"));
const errors_1 = require("../errors");
const messageHandler_1 = require("./messageHandler");
const json_1 = require("../handlers/json");
/**
 * A custom client with a built in command handler!
 *
 * @class Client
 */
class Client extends discord_js_2.default.Client {
    /**
     * @param clientOptions The client options
     */
    constructor(clientOptions = {
        serverJsonPath: './servers.json'
    }) {
        super(clientOptions.discordClientOptions);
        this.clientOptions = clientOptions;
        if (clientOptions.dotenv)
            dotenv_1.config();
        if (clientOptions.dotenv == true) {
            this.clientOptions.clientToken = process.env.TOKEN;
            this.clientOptions.defaultPrefix = process.env.DEFAULT_PREFIX;
        }
        else if (typeof clientOptions.dotenv === 'object') {
            if (clientOptions.dotenv.prefix) {
                this.clientOptions.clientToken = process.env.TOKEN;
            }
            else if (clientOptions.dotenv.token) {
                this.clientOptions.defaultPrefix = process.env.DEFAULT_PREFIX;
            }
        }
        if (!this.clientOptions.defaultPrefix)
            throw errors_1.Prefix;
        this.on('message', this.handleMessage);
        this.on('ready', () => {
            console.log();
            console.log('Logged in as:      ', this.user.username);
            console.log('Client ID:         ', this.user.id);
            console.log('-------------------------------------------');
        });
        this.commands.aliases = new discord_js_1.Collection();
        this.commands.commands = new discord_js_1.Collection();
        this.commands.categories = new discord_js_1.Collection();
        if (clientOptions.autoLogin) {
            if (!clientOptions.clientToken)
                throw errors_1.Token;
            this._login(clientOptions.clientToken);
        }
    }
    /**
     *
     * @param token The Discord bot API token
     * @returns The Discord bot API token
     */
    _login(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token) {
                    if (!this.clientOptions.clientToken)
                        throw errors_1.Token;
                    this.login(this.clientOptions.clientToken);
                    return this.clientOptions.clientToken;
                }
                this.login(token);
                return token;
            }
            catch (error) {
                throw errors_1.Token;
            }
        });
    }
    handleNewServer(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const servers = json_1.readJson(this.clientOptions.serverJsonPath);
            servers[guild.id.toString()] = {};
            servers[guild.id.toString()]["prefix"] = this.clientOptions.defaultPrefix;
            yield json_1.writeJson('./servers.json', servers);
        });
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const servers = yield json_1.readJson(this.clientOptions.serverJsonPath);
            if (servers[message.guild.id] == undefined) {
                yield this.handleNewServer(message.guild);
            }
            const msg = yield messageHandler_1.formatMessage(message.content, servers[message.guild.id]['prefix']);
            if (!msg)
                return;
            const { command, args, rawArgs } = msg;
            var cmd = this.commands.commands.get(command);
            if (!cmd) {
                this.commands.aliases.get(command).forEach(element => {
                    if (this.commands.commands.get(element)) {
                        cmd = this.commands.commands.get(element);
                    }
                });
            }
            if (!cmd)
                return message.reply('Invalid command!');
            if (cmd.requiredPerms) {
                if (cmd.requiredPerms == 'mod') {
                    if (!this.isMod(message.author, message.guild))
                        return;
                }
                else if (cmd.requiredPerms == 'admin') {
                    if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR'))
                        return;
                }
                else if (cmd.requiredPerms == 'owner') {
                    if (!message.guild.member(message.author).hasPermission(null, { checkOwner: true }))
                        return;
                }
                else if (typeof cmd.requiredPerms === 'object') {
                    cmd.requiredPerms.forEach((requiredPerm) => {
                        if (!message.guild.member(message.author).hasPermission(requiredPerm))
                            return;
                    });
                }
                else {
                    if (!message.guild.member(message.author).hasPermission(cmd.requiredPerms))
                        return;
                }
            }
            if (!(yield cmd.run(this, message, args, rawArgs))) {
                message.reply('there was an error executing that command!');
            }
        });
    }
    isMod(user, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            var isMod = false;
            const perms = ['BAN_MEMBERS', 'DEAFEN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_EMOJIS',
                'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS'];
            perms.forEach((permission) => {
                if (guild.member(user).hasPermission(permission))
                    isMod = true;
            });
            return isMod;
        });
    }
}
exports.Client = Client;
