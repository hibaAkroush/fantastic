import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from "angularfire2/auth"
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SignUpPage } from "../pages/sign-up/sign-up";
import {MainPage} from "../pages/main/main";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook'

 

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignUpPage,
    MainPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAUipRdjwgFm76lPfFCVWH84OWKSY5S32I",
      authDomain: "fantastic-13633.firebaseapp.com",
      databaseURL: "https://fantastic-13633.firebaseio.com",
      projectId: "fantastic-13633",
      storageBucket: "fantastic-13633.appspot.com",
      messagingSenderId: "1014964753035"
    }),
    AngularFireAuthModule,
    AngularFireDatabaseModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignUpPage,
    MainPage
  ],
  providers: [
    Facebook,
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider
    
  ]
})
export class AppModule {}
