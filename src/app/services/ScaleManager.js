import WS from '../WS';
const log = require('misc/loglevel').getLogger('ScaleManager'); // eslint-disable-line no-unused-vars

export default WS.Services.ScaleManager = class ScaleManager {
    static init(options) {
      this.width = options.width;
      this.height = options.height;
      log.info(`Initializing game scale to width ${this.width}px and height ${this.height}px`);
    }
    static xp(percentage) {
      log.debug(`x: ${percentage * this.width / 100} = ${percentage} * ${this.width} / 100`);
      return percentage * this.width / 100;
    }
    static yp(percentage) {
      log.debug(`y: ${percentage * this.height / 100} = ${percentage} * ${this.height} / 100`);
      return percentage * this.height / 100;
    }
};