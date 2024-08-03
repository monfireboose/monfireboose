import { initializeApp } from 'firebase/app';

interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

class FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;

  constructor({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  }: IFirebaseConfig) {
    this.apiKey = apiKey;
    this.authDomain = authDomain;
    this.projectId = projectId;
    this.storageBucket = storageBucket;
    this.messagingSenderId = messagingSenderId;
    this.appId = appId;
    this.measurementId = measurementId;
  }
}

const connect = (firebaseConfig: FirebaseConfig) => {
  return new Promise((resolve, reject) => {
    const app = initializeApp(firebaseConfig);

    if (app && app.name) {
      resolve(app);
    } else {
      reject('Failed to initialize Firebase app');
    }
  });
};

export { connect, FirebaseConfig };
