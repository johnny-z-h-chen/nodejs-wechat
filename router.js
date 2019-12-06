const controllers = require('require-all')(`${__dirname}/controllers`);
const applicationConfiguration = require('./config/application-configuration');

const apiPrefixpath = applicationConfiguration.apiprefix;

module.exports = function (app) {
  app
    .route(`${apiPrefixpath}/wechat`)
    .get(controllers.wechatController.wechatIntegration);

  // handle the message request from wechat
  app
    .route(`${apiPrefixpath}/wechat`)
    .post(controllers.messageController.handleMessageFromWechat);

  app
    .route(`${apiPrefixpath}/wechat/menu`)
    .get(controllers.menuController.updateMenu);

  app
    .route(`${apiPrefixpath}/wechat/authentication`)
    .get(controllers.wechatController.webAuthentication);

  app
    .route(`${apiPrefixpath}/wechat/image`)
    .get(controllers.articleController.uploadImage);
};
