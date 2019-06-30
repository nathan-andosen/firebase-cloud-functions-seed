import { 
  ApiResponseService 
} from '../../../src/services/api-response.service';
import * as DI from '../../../src/services/dependency-injection.service';
import { Err } from '../../../src/models/err.model';
import { MockResponse } from '../../mocks';

// MOCKS //////////////

class LogServiceMock {
  logError(err: Error): void {}
};


// SPECS /////////////

/**
 * ApiResponseService
 */
describe('ApiResponseService', () => {
  let mockResponse: MockResponse;
  const logService = new LogServiceMock();

  beforeAll(() => {
    mockResponse = new MockResponse();
    DI.override('LogService', logService);
  });




  /**
   * send()
   */
  describe('send()', () => {
    it('should send response', () => {
      spyOn(mockResponse, 'send').and.callFake((responseData) => {
        expect(responseData.data.test).toEqual(123);
        return mockResponse;
      });
      const apiResponseSrv = new ApiResponseService();
      apiResponseSrv.send(<any>mockResponse, { test: 123 });
    });
  });




  /**
   * sendError()
   */
  describe('sendError()', () => {
    it('should send error message response', () => {
      const errMsg = 'This is the error msg';
      let cnt = 0;
      spyOn(mockResponse, 'send').and.callFake((responseData) => {
        expect(responseData.error).toEqual(errMsg);
        cnt++;
        return mockResponse;
      });
      const apiResponseSrv = new ApiResponseService();
      apiResponseSrv.sendError(<any>mockResponse, errMsg);
      apiResponseSrv.sendError(<any>mockResponse, new Err(errMsg));
      apiResponseSrv.sendError(<any>mockResponse, new Error(errMsg));
      apiResponseSrv.sendError(<any>mockResponse, { message: errMsg });
      expect(cnt).toEqual(4);
    });

    it('should log error', () => {
      const errMsg = 'This is the error msg';
      spyOn(mockResponse, 'send').and.callFake((responseData) => {
        expect(responseData.error).toEqual(errMsg);
        return mockResponse;
      });
      const spyLogError = spyOn(logService, 'logError')
      .and.callFake((err: Error) => {
        expect(err.message).toEqual(errMsg);
      });
      const apiResponseSrv = new ApiResponseService();
      apiResponseSrv.sendError(<any>mockResponse, { message: errMsg });
      expect(spyLogError).toHaveBeenCalledTimes(1);
    });

    it('should set a different status', () => {
      const errMsg = 'This is the error msg';
      const status = 401;
      const spySend = spyOn(mockResponse, 'send')
      .and.callFake((responseData) => {
        expect(responseData.error).toEqual(errMsg);
        return mockResponse;
      });
      const spyStatus = spyOn(mockResponse, 'status')
      .and.callFake((resStatus) => {
        expect(resStatus).toEqual(status);
        return mockResponse;
      });
      const apiResponseSrv = new ApiResponseService();
      apiResponseSrv.sendError(<any>mockResponse, 
        new Err(errMsg, { status: status }));
      expect(spyStatus).toHaveBeenCalledTimes(1);
      expect(spySend).toHaveBeenCalledTimes(1);
    });

    it('should handle null error', () => {
      const spySend = spyOn(mockResponse, 'send')
      .and.callFake((responseData) => {
        expect(responseData.error).toEqual('Unexpected error');
        return mockResponse;
      });
      const apiResponseSrv = new ApiResponseService();
      apiResponseSrv.sendError(<any>mockResponse, null);
      expect(spySend).toHaveBeenCalledTimes(1);
    });
  });
});