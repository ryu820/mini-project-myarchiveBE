const { Users } = require("../models");
class UserRepository {
    constructor() { }
    findById = async ({ accountId }) => {
        const check = await Users.findOne({ where: { accountId } });
        return check;
    }
    findByNick = async ({ nick }) => {
        const check = await Users.findOne({ where: { nick } });
        return check;
    }
    createUser = async ({ accountId, password, nick }) => {
        var today = new Date();

        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var dateString = year + '-' + month + '-' + day;
        console.log(dateString)

        await Users.create({
            accountId,
            password,
            nick,
            createdAt: dateString,
            updatedAt: dateString
        });
    }

}

module.exports = UserRepository;