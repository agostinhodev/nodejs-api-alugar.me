const crypto = require('crypto')

module.exports = async function encryptPassword(password){
    
    let passwordHash = await crypto.createHash('md5').update(password).digest("hex");
    return passwordHash;

};