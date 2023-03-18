'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'userId',
      });
    }
  }
  Posts.init({
    post_Id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false, // NOT NULL
      type: DataTypes.INTEGER,
    },
    url: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: "http://img2.tmon.kr/cdn3/deals/2020/01/29/2871459710/2871459710_front_309d9b16a1.jpg"
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING
    },
    desc: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isDone: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};