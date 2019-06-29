// https://github.com/nicolasdao/webfunc/blob/master/src/cors.js

export const cors = (req, res, cb: () => Promise<any>) => {
  return new Promise((resolve, reject) => {
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 
      'Authorization, Content-Type, Origin');
    const method = req.method && req.method.toUpperCase();
    if(method === 'OPTIONS') {
      res.status(200).send();
      resolve();
    } else {
      cb().then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    }
  });
};