

export interface iErrOptions {
  status?: number;
  type?: number;
}

/**
 * Err model
 *
 * @export
 * @class Err
 * @extends {Error}
 */
export class Err extends Error {
  status: number;
  static TYPES = {
    UNKNOWN: 0,
    USER_NOT_FOUND: 1
  };
  public type: number;


  /**
   *Creates an instance of Err.
   * @param {string} [message]
   * @param {iErrOptions} [options]
   * @memberof Err
   */
  constructor(message?: string, options?: iErrOptions) {
    super();
    const opt = options || {};
    if(message) {
      this.message = message;
    }
    this.status = (opt.status) ? opt.status : 500;
    this.type = (opt.type) ? opt.type : Err.TYPES.UNKNOWN;
  }


  /**
   * Set the status (this is the http status code)
   *
   * @param {*} status
   * @memberof Err
   */
  setStatus(status) {
    this.status = status;
  }
}