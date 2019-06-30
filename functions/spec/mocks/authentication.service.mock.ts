import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';

export class MockAuthenticationService {
  authenticate(req: functions.Request, adminAuth: auth.Auth): Promise<any> {
    return Promise.resolve({});
  }
}