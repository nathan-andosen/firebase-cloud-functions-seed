import { DB_COLLECTIONS } from '../../src/constants';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/**
 * Helper service for the firestore database
 *
 * @export
 * @class FirestoreHelper
 */
export class FirestoreHelper {
  private appendToCollectionPath: string = '-e2e';


  /**
   * Creates an instance of FirestoreHelper.
   * 
   * @memberof FirestoreHelper
   */
  constructor() {
    this.initializeApp();
  }


  /**
   * Initialise the firebase app
   *
   * @memberof FirestoreHelper
   */
  initializeApp() {
    if(admin.apps.length === 0) {
      admin.initializeApp(functions.config().firebase);
    }
  }


  /**
   * We must delete the app as the initializeApp() function starts
   * background tasks, which will keep the node process alive, which wont
   * close the tests.
   *
   * @returns {Promise<any>}
   * @memberof FirestoreHelper
   */
  deleteApp(): Promise<any> {
    if (admin.apps.length > 0) {
      return admin.apps[0].delete();
    }
    return Promise.resolve();
  }

  enableE2eForCollections() {
    this.appendToCollectionPath = '-e2e';
  }

  disabledE2eForCollections() {
    this.appendToCollectionPath = '';
  }

  /**
   * Get the collection path. You should use this always, as e2e tests use
   * different collections
   *
   * @param {string} collection
   * @returns
   * @memberof FirestoreHelper
   */
  getCollectionPath(collection: string) {
    return collection + this.appendToCollectionPath;
  }


  /**
   * Update a document in the database
   *
   * @param {string} collection
   * @param {string} uid
   * @param {*} updateObj
   * @returns {Promise<any>}
   * @memberof FirestoreHelper
   */
  updateDocInDatabase(collection: string, uid: string, updateObj: any)
  : Promise<any> {
    const collectionPath = this.getCollectionPath(collection);
    const db = admin.firestore();
    const docRef = db.collection(collectionPath).doc(uid);
    return docRef.update(updateObj);
  }


  /**
   * Insert a document into the database
   *
   * @param {string} collection
   * @param {string} uid
   * @param {*} data
   * @returns {Promise<boolean>}
   * @memberof FirestoreHelper
   */
  insertDocIntoDatabase(collection: string, uid: string, data: any)
  : Promise<boolean> {
    const collectionPath = this.getCollectionPath(collection);
    const db = admin.firestore();
    const docRef = db.collection(collectionPath).doc(uid);
    return docRef.set(data)
    .then(() => {
      return Promise.resolve(true);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  }


  /**
   * Get the collection reference object
   *
   * @param {string} collection
   * @returns
   * @memberof FirestoreHelper
   */
  getCollectionRef(collection: string) {
    const collectionPath = this.getCollectionPath(collection);
    const db = admin.firestore();
    const colRef = db.collection(collectionPath);
    return colRef;
  }


  /**
   * Get the db
   *
   * @returns {FirebaseFirestore.Firestore}
   * @memberof FirestoreHelper
   */
  getDb(): FirebaseFirestore.Firestore {
    return admin.firestore();
  }


  /**
   * Get a document from the database
   *
   * @param {string} collection
   * @param {string} uid
   * @returns {Promise<any>}
   * @memberof FirestoreHelper
   */
  getDoc(collection: string, uid: string): Promise<any> {
    const collectionPath = this.getCollectionPath(collection);
    const db = admin.firestore();
    const docRef = db.collection(collectionPath).doc(uid);
    return docRef.get().then((doc) => {
      if(!doc.exists) return Promise.resolve(null);
      return Promise.resolve(doc.data());
    }).catch((err) => {
      return Promise.reject(err);
    });
  }


  /**
   * Delete all collections
   *
   * @returns {Promise<boolean>}
   * @memberof FirestoreHelper
   */
  deleteAllCollections(): Promise<any> {
    return new Promise((resolve, reject) => {
      const collections: string[] = [];
      for(const key in DB_COLLECTIONS) {
        collections.push(this.getCollectionPath(DB_COLLECTIONS[key]));
      }
      this.iterateCollectionsToDelete(0, collections, (err: Error) => {
        if(err){ reject(err); return; }
        setTimeout(() => { resolve(); }, 1000);
      });
    });
  }


  /**
   * Iterate an array of collections and delete them
   *
   * @private
   * @param {number} index
   * @param {string[]} collections
   * @param {(err?: Error) => void} cb
   * @returns
   * @memberof FirestoreHelper
   */
  private iterateCollectionsToDelete(index: number, collections: string[],
  cb: (err?: Error) => void) {
    if(index >= collections.length) {
      cb(); return;
    }
    this.deleteCollection(admin.firestore(), collections[index], 10, (err) => {
      if(err) {
        cb(err); return;
      }
      this.iterateCollectionsToDelete(index + 1, collections, cb);
    });
  }


  /**
   * Delete a single collection
   *
   * @public
   * @param {FirebaseFirestore.Firestore} db
   * @param {string} collectionPath
   * @param {number} batchSize
   * @returns {Promise<boolean>}
   * @memberof FirestoreHelper
   */
  public deleteCollection(db: FirebaseFirestore.Firestore, 
  collectionPath: string, batchSize: number, cb: (err?: Error) => void): void {
    const collRef = db.collection(collectionPath);
    const query = collRef.orderBy('__name__').limit(batchSize);
    this.deleteQueryBatch(db, query, batchSize, cb);
  }


  /**
   * Delete all documents in a collection
   *
   * @private
   * @param {FirebaseFirestore.Firestore} db
   * @param {FirebaseFirestore.Query} query
   * @param {number} batchSize
   * @param {(val: boolean) => void} resolve
   * @param {(err: Error) => void} reject
   * @memberof FirestoreHelper
   */
  private deleteQueryBatch(db: FirebaseFirestore.Firestore, 
  query: FirebaseFirestore.Query, batchSize: number, 
  cb: (err?: Error) => void) {
    query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if(snapshot.size === 0) return Promise.resolve(0);
      // Delete documents in a batch
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then((numDeleted) => {
      if(numDeleted === 0) {
        cb(); return;
      }
      this.deleteQueryBatch(db, query, batchSize, cb);
    })
    .catch((err) =>{
      cb(err);
    });
  }
}

const firestoreHelper = new FirestoreHelper();
export { firestoreHelper };