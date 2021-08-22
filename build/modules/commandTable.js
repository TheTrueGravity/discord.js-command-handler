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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandTable = void 0;
const discord_js_1 = require("discord.js");
class commandTable {
    constructor() {
        this.commands = new discord_js_1.Collection();
        this.commandsIndex = new discord_js_1.Collection();
        this.count = 0;
    }
    get(index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof index === 'string') {
                return this.commands.get(index);
            }
            else {
                return this.commands.get(this.commandsIndex.get(index));
            }
        });
    }
    set(name, command) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commands.set(name, command);
            this.commandsIndex.set(this.count, name);
            this.count++;
        });
    }
}
exports.commandTable = commandTable;
const table = new commandTable();
table.get(0);
