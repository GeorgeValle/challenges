const sqlLite= require('../options/sqlite.config');
const tbl_table= "chats";
const Manager = require('../controllers/chat.manager');
const manager = new Manager(sqlLite,tbl_table);

let chat = manager.findAll()

module.exports = chat