import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBj1vvXI8VUMvYCd_0PCtdVIZh70n4iYEA',
  authDomain: 'joindb-4dd40.firebaseapp.com',
  projectId: 'joindb-4dd40',
  storageBucket: 'joindb-4dd40.firebasestorage.app',
  messagingSenderId: '550188192810',
  appId: '1:550188192810:web:2df3a711daf5ca6bb95f53',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth(app);
  email = 'conan@tester.de';
  password = 'D1#tester';
  name = 'Ingo Düsenjäger';

  constructor() {}

  createUser() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...

        console.log('auth Service create works');
        console.log(user, this.email, this.password);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log('auth Service create error');
        console.log(this.email, this.password);
        console.log(errorCode, errorMessage);
        // ..
      });
  }

  loginUser() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log('auth Service login works');
        console.log(user, this.email, this.password);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log('auth Service login error');
        console.log(this.email, this.password);
        console.log(errorCode, errorMessage);
      });
  }
}
