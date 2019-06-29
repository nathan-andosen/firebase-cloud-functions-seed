import * as functions from 'firebase-functions';
import { AuthenticateService } from '../services/authenticate.service';
import { ApiResponseService } from '../services/api-response.service';
import { FirebaseService } from '../services/firebase.service'; 
import { UtilityService } from '../services/utility.service';
import { LogService } from '../services/log.service';
import { cors } from '../services/cors.service';
import * as DI from '../services/dependency-injection.service';
import { DB_COLLECTIONS } from '../constants';

/**
 * All http functions for Firebase should extend this class
 *
 * @export
 * @abstract
 * @class HttpFunction
 */
export abstract class HttpFunction {
  @DI.Inject(ApiResponseService)
  protected apiResponseSrv: ApiResponseService;
  @DI.Inject(AuthenticateService)
  protected authenticateSrv: AuthenticateService;
  @DI.Inject(FirebaseService)
  protected firebaseSrv: FirebaseService;
  @DI.Inject(UtilityService)
  protected utilitySrv: UtilityService;
  @DI.Inject(LogService)
  protected logService: LogService;

  protected cors = cors;
  protected DB_COLLECTIONS = DB_COLLECTIONS;

  protected getDb(): FirebaseFirestore.Firestore {
    return this.firebaseSrv.getDb();
  }

  abstract execute(req: functions.Request, res: functions.Response): Promise<any>;
}