import admin from "firebase-admin";
import fs from 'fs';

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("connected")

const db= admin.firestore();
// const products = db.collection('products');
// const carts =  db.collection('carts');

export {db};