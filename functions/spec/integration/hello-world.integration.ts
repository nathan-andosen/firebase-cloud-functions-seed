import * as myFunctions from '../../src/index';
import { firestoreHelper } from '../support/firestore-helper';
import { MockRequest, MockResponse } from '../mocks';
import { DB_COLLECTIONS } from '../../src/constants';


const mockRes = new MockResponse();
const mockReq = new MockRequest();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('Hello World', () => {
  const before = function(resolve) {
    // only need to delete all collections in the first integration test
    firestoreHelper.deleteAllCollections()
    .then(() => {
      resolve();
    })
    .catch((err) => {
      throw err;
    });
  };

  beforeAll((done) => {
    // before all integration tests, we delete all collections
    new Promise(before).then((() => {
      done();
    })).catch((err) => { throw err; });
  }, 30000);

  it('spec 1: should write to database and return success message', (done) => {
    spyOn(mockRes, 'send').and.callFake((responseData) => {
      if(responseData.error) console.log('spec 1: ' + responseData.error);
      expect(responseData.data.message).toEqual('success');
      firestoreHelper.getDoc(DB_COLLECTIONS.SIMPLE, 'integration123')
      .then((data: any) => {
        expect(data).toBeDefined();
        done();
      })
      .catch((err) => { throw err; });
      return mockRes;
    });
    spyOn(mockReq, 'get').and.callFake((header: string) => {
      if(header === 'X-Uid') return 'integration123';
      return '';
    });
    mockReq.body = { message: 'Data from integration test' };
    myFunctions['helloWorld'](<any>mockReq, <any>mockRes);
  });

});