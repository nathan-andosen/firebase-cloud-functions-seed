import * as functions from 'firebase-functions';


/**
 * Utility service
 *
 * @export
 * @class UtilityService
 */
export class UtilityService {

  /**
   * Get the running env
   *
   * @returns {string}
   * @memberof UtilityService
   */
  getRunningEnv(): string {
    return functions.config().running.env;
  }
}