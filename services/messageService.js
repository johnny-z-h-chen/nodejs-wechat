const request = require('request');
const ejs = require('ejs');
const axios = require('axios');
const applicationConfiguration = require('../config/application-configuration');

const { getAccessToken } = require('./wechatService');
const { messageTpl } = require('../commons/messageTemplate');
const { consoleLogger } = require('../utils/LoggerUtils');

const axiosInstance = axios.create({
  baseURL: applicationConfiguration.wechatInfo.wechatBaseUrl,
  timeout: applicationConfiguration.httpRequestTimeout * 1000,
});

/**
 * sending the image text message the users by openIDs
 * @param {*} openIDs the target users
 * @param {*} imageTextMessageInfo the detail about images text message
 */
const sendimageTextMessage = async (openIDs, imageTextMessageInfo) => {
  const accessToken = await getAccessToken();
  const url = `/cgi-bin/message/mass/send?access_token=${accessToken}`;

  // prepare the parameter
  const parameter = {
    touser: openIDs,
    mpnews: {
      media_id: imageTextMessageInfo.media_id,
    },
    msgtype: 'mpnews',
    send_ignore_reprint: 0,
  };

  const response = await axiosInstance.post(url, parameter);
  return response;
};

/**
 * prepare the text message
 * @param {*} message
 * @param {*} responseText
 */
const prepareTextMessage = async (message, responseText) => {
  const reply = {
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
    createTime: new Date().getTime(),
    msgType: 'text',
    content: responseText,
  };
  const output = ejs.render(messageTpl, reply);
  return output;
};

module.exports = {
  sendimageTextMessage,
  prepareTextMessage,
};
