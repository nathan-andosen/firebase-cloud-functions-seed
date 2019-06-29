import { Err } from '../models/err.model';

/**
 * Log service used to log messages or errors to Firebase function logs
 *
 * @export
 * @class LogService
 */
export class LogService {

  /**
   * Log debug info
   *
   * @param {string} msg
   * @memberof LogService
   */
  logInfo(msg: string) {
    console.log(msg);
  }


  /**
   * Log an error
   *
   * @param {*} err
   * @memberof LogService
   */
  logError(err: any): void {
    if(typeof err === 'string' || err instanceof String) {
      console.error(new Error(<any>err));
    } else if(err instanceof Err || err instanceof Error) {
      console.error(err);
    } else if(err && err.message) {
      console.error(new Error(err.message));
    } else {
      console.error(new Error('Unknown error'));
    }
  }
}