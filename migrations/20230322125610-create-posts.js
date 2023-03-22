'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      postid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Users 모델을 참조합니다.
          key: 'userId', // Users 모델의 userId를 참조합니다.
        },
        onDelete: 'CASCADE', // 만약 Users 모델의 userId가 삭제되면, Posts 모델의 데이터가 삭제됩니다.
      },
      url: {
        type: Sequelize.STRING,
        defaultValue:
          "http://img2.tmon.kr/cdn3/deals/2020/01/29/2871459710/2871459710_front_309d9b16a1.jpg",
      },
      img: {
        type: Sequelize.STRING,
        defaultValue:
          "http://img2.tmon.kr/cdn3/deals/2020/01/29/2871459710/2871459710_front_309d9b16a1.jpg",
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      desc: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isDone: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updatedAt: {
        allowNull: false,

        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};