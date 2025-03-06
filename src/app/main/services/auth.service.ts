import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseConfig = {
    // ...
  };
  // Initialize Firebase
  // app = initializeApp(this.firebaseConfig);
  auth = getAuth();
  email = 'conan@tester.de';
  password = 'D1#tester';

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
