const { FAIL_UPDATE_MENUS } = require('../models/ErrorResponseList');
const { SUCCESS_UPDATE_MENUS } = require('../models/SuccessResponseList');
const { eventAlert } = require('../utils/LoggerUtils');
const { uploadArticle } = require('../services/articleService');

const articles = require('../resource/articles.json');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const uploadImage = async (req, res, next) => {
  const response = await uploadArticle(articles);
  console.log(response.data);
  res.send(response.data);
};

module.exports = {
  uploadImage,
};
