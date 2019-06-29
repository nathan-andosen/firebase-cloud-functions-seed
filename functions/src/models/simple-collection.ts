import { FirebaseService } from '../services/firebase.service';
import * as DI from '../services/dependency-injection.service';
import { Err } from './err.model';
import { DB_COLLECTIONS } from '../constants';


export class SimpleCollection {
  @DI.Inject(FirebaseService)
  private firebaseSrv: FirebaseService;
  private uid: string;

  constructor(uid: string) {
    if(!uid) throw new Err('Uid not set when constructing a new user');
    this.uid = uid;
  }

  createDoc(data: any): Promise<boolean> {
    return this.firebaseSrv.getCollection(DB_COLLECTIONS.SIMPLE)
    .doc(this.uid).set(data)
    .then((result) => {
      return Promise.resolve(true);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  }
}