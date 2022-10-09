const sqlLite= require('../options/sqlite.config');
try{
const tbl_chats= "chats";
const Manager = require('../controllers/chat.manager');
const manager = new Manager(sqlLite,tbl_chats);

let chat = manager.findAll()
}catch(err){console.log(err)}       

module.exports = chat