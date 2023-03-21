const { Users } = require("../models");
class UserRepository {
    constructor(){}
    findId = async ({ accountId }) => {
        const check = await Users.findOne({ where: { accountId } });
        return check;
    }
    findNick = async ({ nick }) => {
        const check = await Users.findOne({ where: { nick } });
        console.log(check)
        return check;
    }
    createUser = async ({ accountId, password, nick }) => {
        await Users.create({ accountId, password, nick });
    }
    
}

module.exports = UserRepository;