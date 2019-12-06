const sha1 = require('sha1');
const applicationConfiguration = require('../config/application-configuration');

const { validateRequired } = require('../utils/ValidatorUtils');
const { FIELD_INCORRECT } = require('../models/ErrorResponseList');
const { eventAlert } = require('../utils/LoggerUtils');

/**
 * integrate with wechat
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const wechatIntegration = async (req, res, next) => {
  const { signature } = req.query;
  const { timestamp } = req.query;
  const { nonce } = req.query;
  const { echostr } = req.query;

  // parameter checking - when the one error is occur, the procedure will be complete
  Promise.race([
    validateRequired(signature, FIELD_INCORRECT('signature')),
    validateRequired(signature, FIELD_INCORRECT('timestamp')),
    validateRequired(signature, FIELD_INCORRECT('nonce')),
    validateRequired(signature, FIELD_INCORRECT('echostr')),
  ])
    .then(validationResult => {
      if (validationResult) {
        throw validationResult;
      }

      // checking that whether the info is sent by wechat
      const sourceSignature = [
        applicationConfiguration.wechatInfo.token,
        timestamp,
        nonce,
      ]
        .sort()
        .join('');

      const sha = sha1(sourceSignature);

      if (sha === signature) {
        eventAlert.info('success to integrate with wechat');
        res.send(echostr);
      } else {
        eventAlert.info(
          `the code is ${sha} and the target signature is ${signature}`
        );
        res.send('wechat authentication fail');
      }
    })
    .catch(error => {
      next(error);
    });
};

/**
 * wechat authentication for web
 * @param {*} req
 * @param {*} res
 */
const webAuthentication = (req, res) => {
  res.redirect(applicationConfiguration.wechatInfo.webAuthenticationUrl);
};

module.exports = {
  wechatIntegration,
  webAuthentication,
};
