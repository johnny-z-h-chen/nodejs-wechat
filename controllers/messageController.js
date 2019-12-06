const contentType = require('content-type');
const getRawBody = require('raw-body');

const { prepareTextMessage } = require('../services/messageService');
const { parseXML } = require('../utils/CommonUtils');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const handleMessageFromWechat = async (req, res, next) => {
  // retrieve the message info
  const xmlMessageInfo = await getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: contentType.parse(req).parameters.charset || 'utf-8',
  });

  const messageInfo = await parseXML(xmlMessageInfo);

  // prepare the info
  const replyInfo = await prepareTextMessage(
    messageInfo.xml,
    'yah, we have received your info la'
  );

  res.send(replyInfo);
};

module.exports = {
  handleMessageFromWechat,
};
