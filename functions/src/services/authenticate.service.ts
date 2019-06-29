import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';
import { Err } from '../models/err.model';
import { UtilityService } from './utility.service';
import * as DI from './dependency-injection.service';
import { RUNNING_ENVS } from '../constants';


/**
 * Authenticate a https request for Firebase
 *
 * @export
 * @class AuthenticateService
 */
export class AuthenticateService {
  @DI.Inject(UtilityService)
  private utilitySrv: UtilityService;
  
  /**
   * Authenticate a https route request
   *
   * @param {functions.Request} req
   * @param {auth.Auth} adminAuth
   * @returns {Promise<auth.DecodedIdToken>}
   * @memberof AuthenticateService
   */
  authenticate(req: functions.Request, 
  adminAuth: auth.Auth): Promise<auth.DecodedIdToken> {
    return new Promise((resolve, reject) => {
      if(this.utilitySrv.getRunningEnv() !== RUNNING_ENVS.PROD
      && this.utilitySrv.getRunningEnv() !== RUNNING_ENVS.STAGING) {
        const uid = req.get('X-Uid');
        resolve(<any>{ 
          uid: (uid) ? uid : 'no-uid' 
        }); 
        return;
      }
      const authHeader = req.get('Authorization');
      if(!authHeader) {
        reject(new Err('Unauthorized', { status: 401 })); return;
      }
      const tokenId = authHeader.split('Bearer ')[1];
      adminAuth.verifyIdToken(tokenId)
      .then((decoded) => {
        resolve(decoded);
      })
      .catch((err) => {
        reject(new Err('Unauthorized', { status: 401 })); return;
      });
    });
  }
}