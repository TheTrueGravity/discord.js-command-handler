"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./modules/client");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const client = new client_1.Client({
    autoLogin: true,
    dotenv: true
});
