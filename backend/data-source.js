"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./src/modules/auth/user.entity");
var notes_header_entity_1 = require("./src/modules/notes/notes-header.entity");
var notes_details_entity_1 = require("./src/modules/notes/notes-details.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: ((_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.includes('localhost'))
        ? false
        : { rejectUnauthorized: false },
    entities: [user_entity_1.User, notes_header_entity_1.NoteHeader, notes_details_entity_1.NoteDetails],
    migrations: process.env.NODE_ENV === 'production'
        ? ['dist/migrations/*.js']
        : ['src/migrations/*.ts'],
    synchronize: false,
});
