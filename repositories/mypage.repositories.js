const { Posts, Users } = require("../models");
class MypageRepository {
    constructor() { }

    FindAll = async (userId, isDone) => {
        const mypagelist = await Posts.findAll({
            raw: true,
            attributes: [
                "postId",
                "User.nick",
                "url",
                "img",
                "title",
                "category",
                "desc",
                "isDone",
            ],
            include: [
                {
                    model: Users,
                    attributes: []
                }
            ],
            where: {
                userId: userId,
                isDone: isDone,
            },
            order: [["createdAt", "DESC"]],
        });
        return mypagelist;
    }

    FindOne = async ({ postId, userId }) => {
        const existPost = await Posts.findOne({
            where: {
                postId: postId,
                userId: userId,
            },
        });
        return existPost;
    }

    updatePost = async ({ postId, userId, postUrl, imageUrl, title, desc }) => {
        var today = new Date();

        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var dateString = year + '-' + month + '-' + day;
        await Posts.update(
            {
                url: postUrl,
                img: imageUrl,
                title,
                desc,
                updatedAt: dateString
            },
            { where: { postId, userId } }
        );
    }
    updateWishList = async ({ postId, userId, done }) => {
        var today = new Date();

        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var dateString = year + '-' + month + '-' + day;
        await Posts.update({
            isDone: done,
            updatedAt: dateString
        }, {
            where: { postId, userId }
        });
    }

}

module.exports = MypageRepository;