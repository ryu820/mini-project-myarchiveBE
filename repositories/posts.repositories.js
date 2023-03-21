// const { Posts, Users } = require("../models");
// const { Op } = require("sequelize");

// class PostRepository extends Posts {
//   constructor() {
//     super();
//   }

//   getPosts = async () => {
//     const findPosts = await Posts.findAll({
//       raw: true,
//       attributes: [
//         "postId",
//         "User.accountId",
//         "User.nick",
//         "img",
//         "category",
//         "title",
//         "isDone",
//       ],
//       include: [
//         {
//           model: Users,
//           attributes: [],
//         },
//       ],
//     });
//     return findPosts;
//   };

//   createPost = async ({
//     userId,
//     url: postUrl,
//     img: imageUrl,
//     title,
//     category,
//     desc,
//     isDone,
//   }) => {
//     const newPost = await Posts.create({
//       userId,
//       url: postUrl,
//       img: imageUrl,
//       title,
//       category,
//       desc,
//       isDone,
//     });
//     return newPost;
//   };

//   delPost = async (postId, userId) => {
//     const deletePost = await Posts.destroy({
//       where: {
//         [Op.and]: [{ postId }, { userId }],
//       },
//     });
//     return deletePost;
//   };
// }

// module.exports = PostRepository;
