import * as admin from 'firebase-admin';
import { UtilityService } from './utility.service';
import * as DI from './dependency-injection.service';
import { RUNNING_ENVS } from '../constants';

/**
 * Firebase Service
 *
 * @export
 * @class FirebaseService
 */
export class FirebaseService {
  private db: FirebaseFirestore.Firestore;
  @DI.Inject(UtilityService)
  private utilitySrv: UtilityService;

  /**
   * Get the db for firestore
   *
   * @returns {FirebaseFirestore.Firestore}
   * @memberof FirebaseService
   */
  getDb(): FirebaseFirestore.Firestore {
    if(!this.db) {
      this.db = admin.firestore();
    }
    return this.db;
  }


  /**
   * Get the collection reference, it will be different for integration tests.
   *
   * @param {string} collectionName
   * @returns {FirebaseFirestore.CollectionReference}
   * @memberof FirebaseService
   */
  getCollection(collectionName: string): FirebaseFirestore.CollectionReference {
    let path = collectionName;
    if(this.utilitySrv.getRunningEnv() === RUNNING_ENVS.TEST) {
      path += '-e2e';
    }
    return this.getDb().collection(path);
  }


  /**
   * Get the FieldValue for firestore
   *
   * @returns {typeof FirebaseFirestore.FieldValue}
   * @memberof FirebaseService
   */
  getFieldValue(): typeof FirebaseFirestore.FieldValue {
    return admin.firestore.FieldValue;
  }


  /**
   * Send a push notification
   *
   * @param {string} token
   * @param {*} msgData
   * @returns {Promise<string>}
   * @memberof FirebaseService
   */
  sendPushNotification(token: string, 
  message: admin.messaging.Message): Promise<string> {
    message['token'] = token;
    return admin.messaging().send(message);
  }
}