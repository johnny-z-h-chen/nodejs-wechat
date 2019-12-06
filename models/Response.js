const uuidv1 = require('uuid/v1');

class Response {
  constructor(httpCOde, code, message) {
    this.status = httpCOde;
    this.id = uuidv1();
    this.code = code;
    this.message = message;
  }
}

module.exports = Response;
