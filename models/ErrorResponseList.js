const Response = require('./Response');

module.exports = {
  FIELD_INCORRECT: field => new Response(
    412,
    '100001',
    `the format of parameters [${field}] is incorrect`
  ),
  FAIL_UPDATE_MENUS: () => new Response(500, '100002', 'fail to update the wechat menu'),
  FAIL_RETRIEVE: errorInfo => new Response(
    500,
    '100003',
    `fail to retrieve the access token [${errorInfo}]`
  ),
};
