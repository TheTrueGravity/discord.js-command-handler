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
exports.formatMessage = void 0;
function formatMessage(message, prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof prefix === 'object') {
            var hasPrefix = false;
            prefix.forEach(element => {
                if (message.toLowerCase().startsWith(element)) {
                    hasPrefix = true;
                }
                if (!hasPrefix)
                    return false;
            });
        }
        else {
            if (!message.startsWith(prefix))
                return false;
        }
        var args;
        var rawArgs;
        if (typeof prefix === 'object') {
            prefix.forEach(element => {
                if (message.toLowerCase().startsWith(element)) {
                    args = message.slice(element.length).trim().split(/ +/g);
                    rawArgs = message.slice(element.length).trimStart().replace(element, "");
                }
            });
        }
        else {
            args = message.slice(prefix.length).trim().split(/ +/g);
            rawArgs = message.slice(prefix.length).trimStart().replace(prefix, "");
        }
        return {
            command: args.shift().toLowerCase(),
            args: args,
            rawArgs: rawArgs
        };
    });
}
exports.formatMessage = formatMessage;
