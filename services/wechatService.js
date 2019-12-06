const axios = require('axios');
const cache = require('memory-cache');
const applicationConfiguration = require('../config/application-configuration');

const { eventAlert, consoleLogger } = require('../utils/LoggerUtils');
const { FAIL_RETRIEVE } = require('../models/ErrorResponseList');

const axiosInstance = axios.create({
  baseURL: applicationConfiguration.wechatInfo.wechatBaseUrl,
  timeout: applicationConfiguration.httpRequestTimeout * 1000,
});

/**
 * get the access token
 */
const getAccessToken = async () => {
  // retrieve the access Token from cache
  let accessToken = cache.get('wechat_access_token');

  if (accessToken === null || accessToken === undefined || accessToken === '') {
    consoleLogger.info('start to refresh the accessToken');
    const url = `/cgi-bin/token?grant_type=client_credential&appid=${applicationConfiguration.wechatInfo.appid}&secret=${applicationConfiguration.wechatInfo.appsecret}`;
    const response = await axiosInstance.get(url);

    if (response && response.status === 200 && !response.data.errcode) {
      accessToken = response.data.access_token;

      // update to cache
      cache.put(
        'wechat_access_token',
        accessToken,
        applicationConfiguration.wechatInfo.accessTokenExpireTime * 1000,
        () => {
          consoleLogger.info('success to update the cache for accessToken');
        }
      );
    } else {
      eventAlert.error(FAIL_RETRIEVE(JSON.stringify(response.data)));
    }
  }

  return accessToken;
};

/**
 * update the wechat menu
 * @param {*} menus
 */
const changeMenu = async menus => {
  const accessToken = await getAccessToken();
  const url = `/cgi-bin/menu/create?access_token=${accessToken}`;
  const response = await axiosInstance.post(url, menus);
  return response;
};

module.exports = {
  getAccessToken,
  changeMenu,
};
