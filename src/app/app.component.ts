import { Component,ViewChild } from '@angular/core';
import { Platform,MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { MainPage } from "../pages/main/main";
import { HomePage } from '../pages/home/home';
import { SignUpPage } from "../pages/sign-up/sign-up";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any }>;

  constructor(platform: Platform, statusBar: StatusBar, public menu: MenuController, splashScreen: SplashScreen) {

    this.pages = [
      { title: 'HomePage', component: HomePage },
      { title: 'MainPage', component: MainPage },
      { title: 'SignUpPage', component: SignUpPage }
    ];

    var config = {
      apiKey: "AIzaSyAUipRdjwgFm76lPfFCVWH84OWKSY5S32I",
      authDomain: "fantastic-13633.firebaseapp.com",
      databaseURL: "https://fantastic-13633.firebaseio.com",
      projectId: "fantastic-13633",
      storageBucket: "fantastic-13633.appspot.com",
      messagingSenderId: "1014964753035"
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged((user) => {
      console.log("is user vertified? ",user.emailVerified)
      if (user.emailVerified) {
        console.log("this should appear if the user is vertified")
        // If there's no user logged in send him to the LoginPage
        this.rootPage = MainPage;
      } else {

        console.log("this should appear if the user not vertified")
        // If there's a user take him to the home page.
        this.rootPage = HomePage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}

