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
exports.writeJson = exports.readJson = void 0;
const fs_1 = require("fs");
function readJson(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawData = yield fs_1.readFileSync(path, {
            encoding: 'utf8'
        });
        const jsonData = JSON.parse(rawData);
        return jsonData;
    });
}
exports.readJson = readJson;
function writeJson(path, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const writeData = JSON.stringify(data, null, 4);
        yield fs_1.writeFileSync(path, writeData, {
            encoding: 'utf8'
        });
    });
}
exports.writeJson = writeJson;
