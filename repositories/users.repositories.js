const { Users } = require("../models");
class UserRepository {
    constructor(){}
    findById = async ({ accountId }) => {
        const check = await Users.findOne({ where: { accountId } });
        return check;
    }
    findByNick = async ({ nick }) => {
        const check = await Users.findOne({ where: { nick } });
        return check;
    }
    createUser = async ({ accountId, password, nick }) => {
        await Users.create({ accountId, password, nick });
    }
    
}

module.exports = UserRepository;