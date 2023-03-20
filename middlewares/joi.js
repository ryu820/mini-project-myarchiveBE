const Joi = require("joi");

const globalSchema = Joi.object({
  accountId: Joi.string().required(),
  nick: Joi.string().required(),
  comment: Joi.string().max(100).required(),
  title: Joi.string().max(50).required(),
  desc: Joi.string().max(500).required(),
  isDone: Joi.boolean().required(),
  url: Joi.string().valid("http"),
});

module.exports = { globalSchema };
