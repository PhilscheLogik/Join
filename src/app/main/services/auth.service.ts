import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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
const auth = getAuth(app);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //  User Data
  email = 'conan@edo.de';
  password = 'D1#tester';
  name = '';

  //  Authentication State
  isUserLoggedIn = false;

  constructor() {}

  /**
   * Registers a new user with email, password, and name.
   * @param {string} email - The email address of the new user.
   * @param {string} pw - The password for the new user.
   * @param {string} name - The display name of the new user.
   */
  signUp(email: string, pw: string, name: string): void {
    createUserWithEmailAndPassword(auth, email, pw)
      .then((userCredential) => {
        const user = userCredential.user;

        // console.log('auth Service create works');
        // console.log(email, pw, name);

        if (auth.currentUser) {
          updateProfile(auth.currentUser, {
            displayName: name,
          })
            .then(() => {
              // console.log('auth Service signup change name');
              // console.log(name);
              this.name = name;
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;

              // console.log('auth Service change name error');
              // console.log(email, pw);
              // console.log(errorCode, errorMessage);
            });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // console.log('auth Service create error');
        // console.log(email, pw);
        // console.log(errorCode, errorMessage);
      });
  }

  /**
   * Logs in a user with the given email and password.
   * @param {string} email - The user's email address.
   * @param {string} pw - The user's password.
   * @returns {Promise<boolean>} A promise resolving to `true` if login succeeds, otherwise `false`.
   */
  login(email: string, pw: string): Promise<boolean> {
    return signInWithEmailAndPassword(auth, email, pw)
      .then((userCredential) => {
        const user = userCredential.user;
        this.name = user.displayName ?? '';

        // console.log('auth Service login works');
        // console.log(email, pw);

        this.isUserLoggedIn = true;
        return true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // console.log('auth Service login error');
        // console.log(email, pw);
        // console.log(errorCode, errorMessage);
        return false;
      });
  }

  /**
   * Logs out the currently authenticated user.
   */
  logout(): void {
    signOut(auth)
      .then(() => {
        // console.log('User wurde ausgeloggt');
        this.isUserLoggedIn = false;
        this.name = '';
      })
      .catch((error) => {
        console.log('Mist, ist schief gelaufen');
      });
  }
}
