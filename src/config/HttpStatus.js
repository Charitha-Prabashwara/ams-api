class HttpStatus {
  constructor() {
    if (HttpStatus.instance == null) {
      ((this.OK = 200), (this.NOTFOUND = 404));
      HttpStatus.instance = this;
    }
    return HttpStatus.instance;
  }
}

const httpStatus = new HttpStatus();
Object.freeze(httpStatus);
module.exports = httpStatus;
