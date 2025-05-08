// ./config/firebase-admin-config.js
const admin = require('firebase-admin');
const serviceAccount = require('./rungo-app-mob-firebase-adminsdk-fbsvc-69ccb0f0aa.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };