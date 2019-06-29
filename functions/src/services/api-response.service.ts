import * as functions from 'firebase-functions';
import { Err } from '../models/err.model';
import { LogService } from './log.service';
import * as DI from './dependency-injection.service';

/**
 * Service for sending response data back to the client after an ajax request
 *
 * @export
 * @class ApiResponseService
 */
export class ApiResponseService {
  @DI.Inject(LogService)
  private logSrv: LogService;


  /**
   * Send a response back to the client
   *
   * @param {functions.Response} res
   * @param {*} data
   * @param {*} [options]
   * @memberof ApiResponseService
   */
  send(res: functions.Response, data: any, options?: any) {
    res.status(200).send({
      data: data
    });
  }

  
  /**
   * Send an error back to the client
   *
   * @param {functions.Response} res
   * @param {(Err|Error|any)} err
   * @memberof ApiResponseService
   */
  sendError(res: functions.Response, err: Err|Error|any) {
    let status = 500;
    let errMessage = 'Unexpected error';
    if(!err) {
      res.status(status).send({ error: errMessage });
    } else if(typeof err === 'string' || err instanceof String) {
      errMessage = <any>err;
      res.status(status).send({ error: errMessage });
    } else if(err instanceof Err) {
      status = (err.status) ? err.status : 500;
      errMessage = err.message;
      res.status(status).send({ error: errMessage });
    } else if(err instanceof Error || (err && err.message)) {
      errMessage = err.message;
      res.status(status).send({ error: errMessage });
    } else {
      res.status(status).send({ error: errMessage });
    }
    // log error if 500
    if(status === 500) {
      this.logSrv.logError(new Error(errMessage));
    }
  }
}
