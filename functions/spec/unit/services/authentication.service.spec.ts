import { 
  AuthenticateService 
} from '../../../src/services/authenticate.service';
import { Err } from '../../../src/models/err.model';
import * as functions from 'firebase-functions';


// MOCKS //////////////////

class RequestMock {
  get(header: string): string {
    if(header === 'X-Uid') {
      return '123';
    } else if(header === 'Authorization') {
      return null;
    }
    return '';
  }
}

class AdminAuthMock {
  verifyIdToken(tokenId) {
    return null;
  }
}

const requestMock = new RequestMock();
const adminAuthMock = new AdminAuthMock();


// SPECS //////////////////

/**
 * AuthenticateService
 */
describe('AuthenticateService', () => {

  /**
   * authenticate()
   */
  describe('authenticate()', () => {
    it('should get uid from header when not in prod env', (done) => {
      spyOn(<any>functions, 'config').and.callFake(() => {
        return { running: { env: 'dev' }};
      });
      const authSrv = new AuthenticateService();
      authSrv.authenticate(<any>requestMock, <any>adminAuthMock)
      .then((decodedToken) => {
        expect(decodedToken.uid).toEqual('123');
        done();
      }).catch((err) => { console.log(err); });
    });

    it('should return unauthorized as auth header not set', (done) => {
      spyOn(<any>functions, 'config').and.callFake(() => {
        return { running: { env: 'prod' }};
      });
      const authSrv = new AuthenticateService();
      authSrv.authenticate(<any>requestMock, <any>adminAuthMock)
      .then((decodedToken) => {
        return null;
      }).catch((err: Err) => { 
        expect(err.message).toEqual('Unauthorized');
        expect(err.status).toEqual(401);
        done();
      });
    });

    it('should return unauthorized as token is invalid', (done) => {
      spyOn(<any>functions, 'config').and.callFake(() => {
        return { running: { env: 'prod' }};
      });
      spyOn(requestMock, 'get').and.callFake(() => {
        return 'Bearer 123';
      });
      spyOn(adminAuthMock, 'verifyIdToken').and.callFake(() => {
        return Promise.reject(new Error('Invalid'));
      });
      const authSrv = new AuthenticateService();
      authSrv.authenticate(<any>requestMock, <any>adminAuthMock)
      .then((decodedToken) => {
        return null;
      }).catch((err) => { 
        expect(err.message).toEqual('Unauthorized');
        expect(err.status).toEqual(401);
        done();
      });
    });

    it('should return decoded token as its valid', (done) => {
      spyOn(<any>functions, 'config').and.callFake(() => {
        return { running: { env: 'prod' }};
      });
      spyOn(requestMock, 'get').and.callFake(() => {
        return 'Bearer 123';
      });
      spyOn(adminAuthMock, 'verifyIdToken').and.callFake(() => {
        return Promise.resolve({ uid: '456' });
      });
      const authSrv = new AuthenticateService();
      authSrv.authenticate(<any>requestMock, <any>adminAuthMock)
      .then((decodedToken) => {
        expect(decodedToken.uid).toEqual('456');
        done();
      }).catch((err) => { console.log(err); });
    });
  });
});