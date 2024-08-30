import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA8LjSYCOSZ7DuLOcm2cWbROGRiBJmScfI',
  authDomain: 'ispit-tracker.firebaseapp.com',
  projectId: 'ispit-tracker',
  storageBucket: 'ispit-tracker.appspot.com',
  messagingSenderId: '385275069270',
  appId: '1:385275069270:web:ea257dad8191eed7adccf7',
  databaseURL:
    'https://ispit-tracker-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
