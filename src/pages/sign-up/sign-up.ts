import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { User } from "../../models/user";
import { AngularFireAuth } from "angularfire2/auth";
import { HomePage } from "../home/home";
import { MainPage } from "../main/main";
import firebase from "firebase";

@IonicPage()
@Component({
  selector: "page-sign-up",
  templateUrl: "sign-up.html"
})
export class SignUpPage {
  user = {} as User;
  constructor(
    public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    let database = firebase.database();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SignUpPage");
  }
  async register(user: User) {
    console.log("join pressed");
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      console.log(result);
      this.navCtrl.setRoot(HomePage);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
    var Uuser = this.afAuth.auth.currentUser;
    firebase
      .database()
      .ref("users/" + Uuser.uid)
      .set(user);

    Uuser.sendEmailVerification()
      .then(function() {
        console.log("Email sent..................");
      })
      .catch(function(error) {
        console.log("eror..................");
      });
  }
}
