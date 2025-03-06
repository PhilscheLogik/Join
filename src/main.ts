import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

// Your web app's Firebase configuration
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
