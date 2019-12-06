const messageTpl = '<xml>\n'
  + '<ToUserName><![CDATA[<%-toUserName%>]]></ToUserName>'
  + '<FromUserName><![CDATA[<%-fromUserName%>]]></FromUserName>'
  + '<CreateTime><%=createTime%></CreateTime>'
  + '<MsgType><![CDATA[<%=msgType%>]]></MsgType>'
  + '<Content><![CDATA[<%-content%>]]></Content>'
  + '</xml>';

module.exports = {
  messageTpl,
};
