const Joi = require("joi");

const globalSchema = Joi.object({
  accountId: Joi.string().required(),
  nick: Joi.string().required(),
  comment: Joi.string().required(),
  title: Joi.string().required(),
  desc: Joi.string().required(),
  isDone: Joi.boolean().required(),
});

module.exports = { globalSchema };
