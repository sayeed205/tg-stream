import { BaseJob } from 'adonis-resque'

// @inject()
export default class Tg extends BaseJob {
  // constructor(public logger: Logger) {
  //   super()
  // }

  perform() {
    // this.logger.info('Basic example')
    return 'gogogo'
  }
}
