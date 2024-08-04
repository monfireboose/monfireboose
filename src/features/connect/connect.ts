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

/**
 * Represents the configuration for Firebase.
 * @param {string} apiKey - API key for Firebase.
 * @param {string} authDomain - Domain for Firebase authentication.
 * @param {string} projectId - Project ID for Firebase.
 * @param {string} storageBucket - Storage bucket for Firebase.
 * @param {string} messagingSenderId - Messaging Sender ID for Firebase.
 * @param {string} appId - App ID for Firebase.
 * @param {string} [measurementId] - Measurement ID for Firebase (optional).
 */
class FirebaseConfig {
  /**
   * API key for Firebase.
   */
  apiKey: string;
  /**
   * Domain for Firebase authentication.
   */
  authDomain: string;
  /**
   * Project ID for Firebase.
   */
  projectId: string;
  /**
   * Storage bucket for Firebase.
   */
  storageBucket: string;
  /**
   * Messaging Sender ID for Firebase.
   */
  messagingSenderId: string;
  /**
   * App ID for Firebase.
   */
  appId: string;
  /**
   * Measurement ID for Firebase (optional).
   */
  measurementId?: string;

  /**
   * Constructs a new FirebaseConfig object.
   * @param {Object} config - Configuration object.
   * @param {string} config.apiKey - API key for Firebase.
   * @param {string} config.authDomain - Domain for Firebase authentication.
   * @param {string} config.projectId - Project ID for Firebase.
   * @param {string} config.storageBucket - Storage bucket for Firebase.
   * @param {string} config.messagingSenderId - Messaging Sender ID for Firebase.
   * @param {string} config.appId - App ID for Firebase.
   * @param {string} [config.measurementId] - Measurement ID for Firebase (optional).
   */
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

/**
 * Connects to Firebase using the provided configuration and returns a promise that resolves with the initialized app or rejects with an error message.
 *
 * @param {FirebaseConfig} firebaseConfig - The configuration object for initializing the Firebase app.
 * @return {Promise<FirebaseApp>} A promise that resolves with the initialized Firebase app or rejects with an error message.
 */
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
