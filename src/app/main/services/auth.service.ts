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
  email = 'conan@edo.de';
  password = 'D1#tester';
  name = '';
  isUserLoggedIn = false;

  constructor() {}

  signUp(email: string, pw: string, name: string) {
    createUserWithEmailAndPassword(auth, email, pw)
      .then((userCredential) => {
        const user = userCredential.user;

        console.log('auth Service create works');
        console.log(email, pw, name);

        if (auth.currentUser) {
          updateProfile(auth.currentUser, {
            displayName: name,
          })
            .then(() => {
              console.log('auth Service signup change name');
              console.log(name);
              this.name = name;
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;

              console.log('auth Service change name error');
              console.log(email, pw);
              console.log(errorCode, errorMessage);
            });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log('auth Service create error');
        console.log(email, pw);
        console.log(errorCode, errorMessage);
      });
  }

  login(email: string, pw: string): Promise<boolean> {
    return signInWithEmailAndPassword(auth, email, pw)
      .then((userCredential) => {
        const user = userCredential.user;

        console.log('auth Service login works');
        console.log(email, pw);

        this.isUserLoggedIn = true;
        return true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log('auth Service login error');
        console.log(email, pw);
        console.log(errorCode, errorMessage);
        return false;
      });
  }

  logout() {
    signOut(auth)
      .then(() => {
        console.log('User wurde ausgeloggt');
        this.isUserLoggedIn = false;
        this.name = '';
      })
      .catch((error) => {
        console.log('Mist, ist schief gelaufen');
      });
  }
}
