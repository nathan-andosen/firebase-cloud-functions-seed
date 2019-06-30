import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { HttpFunction } from '../http-function.abstract';
import { Err } from '../../models/err.model';
import { SimpleCollection } from '../../models/simple-collection';

class HelloWorld extends HttpFunction {

  private validateRequest(data): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(!data.message) {
        reject(new Err('Invalid parameters', { status: 400 }));
        return;
      }
      resolve(true);
    });
  }

  execute(req: functions.Request, res: functions.Response) {
    return this.cors(req, res, () => {
      let uid: string;
      return this.authenticateSrv.authenticate(req, admin.auth())
      .then((decodedToken) => {
        uid = decodedToken.uid;
        return this.validateRequest(req.body);
      })
      .then(() => {
        this.logService.logInfo('INFO: Creating simple collection');
        const simpleCollection = new SimpleCollection(uid);
        return simpleCollection.createDoc(req.body);
      })
      .then(() => {
        this.apiResponseSrv.send(res, { message: "success" });
        return Promise.resolve();
      })
      .catch((err) => {
        this.apiResponseSrv.sendError(res, err);
        return Promise.resolve();
      });
    });
  }
}

// export our function for Firebase
export const helloWorld = functions.https.onRequest((req, res) => {
  return new HelloWorld().execute(req, res);
});