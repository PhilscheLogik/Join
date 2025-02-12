import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"joindb-4dd40","appId":"1:550188192810:web:2df3a711daf5ca6bb95f53","storageBucket":"joindb-4dd40.firebasestorage.app","apiKey":"AIzaSyBj1vvXI8VUMvYCd_0PCtdVIZh70n4iYEA","authDomain":"joindb-4dd40.firebaseapp.com","messagingSenderId":"550188192810"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
