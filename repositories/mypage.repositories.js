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
        await Posts.update(
            {
                url: postUrl,
                img: imageUrl,
                title,
                desc,
            },
            { where: { postId, userId } }
        );
    }
    updateWishList = async ({ postId, userId , done }) => {
        await Posts.update({ isDone: done }, { where: { postId, userId } });
    }

}

module.exports = MypageRepository;