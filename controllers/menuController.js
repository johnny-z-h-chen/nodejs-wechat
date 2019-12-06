const { changeMenu } = require('../services/wechatService');
const { FAIL_UPDATE_MENUS } = require('../models/ErrorResponseList');
const { SUCCESS_UPDATE_MENUS } = require('../models/SuccessResponseList');
const { eventAlert } = require('../utils/LoggerUtils');

const menus = require('../resource/menu.json');

/**
 * update the menus
 * @param {*} req
 * @param {*} res
 */
const updateMenu = async (req, res, next) => {
  const response = await changeMenu(menus);

  // success to update the wechat menu
  if (response && response.status === 200 && response.data.errmsg === 'ok') {
    eventAlert.info('success to update wechat menu');

    const targetResponse = SUCCESS_UPDATE_MENUS();
    res.status(targetResponse.status).json(targetResponse);
  } else {
    eventAlert.error(
      `fail to update wechat menu [${JSON.stringify(response.data)}]`
    );
    next(FAIL_UPDATE_MENUS());
  }
};

module.exports = {
  updateMenu,
};
