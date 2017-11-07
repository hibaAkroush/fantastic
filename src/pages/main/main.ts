import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import { Geolocation } from "@ionic-native/geolocation";
import { HomePage } from "../home/home";
import { AngularFireDatabase } from "angularfire2/database";
import { User } from "../../models/user";
import firebase from "firebase";

/**
* Generated class for the MainPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
declare var google: any;
// let position;

@IonicPage()
@Component({
  selector: "page-main",
  templateUrl: "main.html"
})
export class MainPage {
  @ViewChild("map") mapElement: ElementRef;
  splash = true;
  map: any;
  user = {} as User;
  nani;
  coordinates = {};
  nanies;
  nearNanny = {};

  public isRequested: boolean;
  public isCanceled: boolean;
  public toggleStatus: boolean;
  constructor(
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public db: AngularFireDatabase
  ) {
    this.isRequested = false;
    this.isCanceled = false;
    this.toggleStatus = false;
    let database = firebase.database();
    db
      .object("nani")
      .valueChanges()
      .subscribe(data => {
        this.nani = data;
      });
  }

  userPosition;
  sessionNum=1;

  ionViewDidLoad() {
    console.log(
      this.afAuth.auth.currentUser.email + "+++++++++++++++++++++++++++++++"
    );
    this.initMap();
    setTimeout(() => (this.splash = false), 3000);
  }

  mail() {
    return this.afAuth.auth.currentUser.email;
  }

  Logout() {
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot(HomePage);
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  initMap() {
    let x = this;
    this.geolocation.getCurrentPosition().then(position => {
      x.userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let location = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        mapTypeId: "terrain"
      });
    });
  }
  ionViewWillLoad() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email) {
        this.toast
          .create({
            message: "welcome to Nany App, ${data.email}",
            duration: 2000
          })
          .present();
      } else {
        this.toast
          .create({
            message: "welcome to Nany App, ${data.email}",
            duration: 2000
          })
          .present();
      }
    });
  }

  showDirectionAndDuration() {
    //direction code
    let x = this;
    let markerArray = [];
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer({
      map: this.map
    });
    let stepDisplay = new google.maps.InfoWindow();
    this.calculateAndDisplayRoute(
      directionsDisplay,
      directionsService,
      markerArray,
      stepDisplay,
      this.map
    );
    var onChangeHandler = function() {
      x.calculateAndDisplayRoute(
        directionsDisplay,
        directionsService,
        markerArray,
        stepDisplay,
        this.map
      );
    };
    // document.getElementById('start').addEventListener('change', onChangeHandler);
    // document.getElementById('end').addEventListener('change', onChangeHandler);
    //duration code

    // var bounds = new google.maps.LatLngBounds;
    // var destination = 'Yaser Mall';
    // var origin = 'Mecca Mall';
    // var origin = {lat: 31.977285, lng: 35.843623};
    // var destination = {lat: 31.955330, lng: 35.834616};
    var origin = this.coordinates;
    x.geolocation.getCurrentPosition().then(position => {
      x.userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });
    var destination = x.userPosition;
    // var geocoder = new google.maps.Geocoder;
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: "DRIVING",
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      },
      function(response, status) {
       
        // console.log(x.distanceInfo)
        if (status !== "OK") {
          alert("Error was: " + status);
        } else {
          var originList = response.originAddresses;
          var destinationList = response.destinationAddresses;
          var outputDiv = document.getElementById("output");
          outputDiv.innerHTML = "";
          for (var i = 0; i < originList.length; i++) {
            var results = response.rows[i].elements;
            // console.log(results);
            console.log(x.nearNanny,'jwan')
            for (var j = 0; j < results.length; j++) {
              // x.distanceInfo['distance'] = results[j].distance.text;
              // x.distanceInfo['duration'] = results[j].duration.text;
              outputDiv.innerHTML +=
                // originList[i] +
                // " to " +
                // destinationList[j] +
                // ": " +
                "Nanny's name: " + x.nearNanny['firstName'] + "<br>"
                + "phone no.: " + x.nearNanny['phoneNumber'] + "<br>"
                + "distance: " + results[j].distance.text + "<br>" 
                + "need about " + results[j].duration.text +
                "<br>";
            }
          }
        }
      }
    );
  }
  
  calculateAndDisplayRoute(
    directionsDisplay,
    directionsService,
    markerArray,
    stepDisplay,
    map
  ) {
    let x = this;
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
    directionsService.route(
      {
        origin: this.coordinates,
        destination: x.userPosition,
        travelMode: "DRIVING"
      },
      function(response, status) {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === "OK") {
          document.getElementById("warnings-panel").innerHTML =
            "<b>" + response.routes[0].warnings + "</b>";
          directionsDisplay.setDirections(response);
          x.showSteps(response, markerArray, stepDisplay, map);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
  showSteps(directionResult, markerArray, stepDisplay, map) {
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = (markerArray[i] =
        markerArray[i] || new google.maps.Marker());
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(
        stepDisplay,
        marker,
        myRoute.steps[i].instructions,
        map
      );
    }
  }
  attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, "click", function() {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }
  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    let content = "<h4>Information..</h4>";
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  } 

  findNani() {
    let name;
    let that = this;
    this.geolocation.getCurrentPosition().then(position => {
      let location = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      console.log(
        "anaaaaaa",
        position.coords.latitude,
        position.coords.longitude
      );
      let nani = that.nani;
      console.log("find", nani);
      let result = {};
      let min = 0;
      let userLat = position.coords.latitude;
      let userlng = position.coords.longitude;
      let distance;
      for (var key in nani) {
        console.log("key:          ", nani[key].available);
        if (nani[key].available) {
          var R = 6371; // Radius of the earth in km
          var dLat = Math.PI / 180 * (userLat - nani[key].lat); // deg2rad below
          var dLon = Math.PI / 180 * (userlng - nani[key].lng);
          var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Math.PI / 180 * nani[key].lat) *
              Math.cos(Math.PI / 180 * userLat) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          distance = R * c; // Distance in km
          result[key] = distance;
          console.log("distance", distance, result);
        }
      }
      let arrayKeys = Object.keys(result);

      let firstKey = arrayKeys[0];
      min = result[firstKey];
      for (var key in result) {
        if (result[key] < min) {
          min = result[key];
        }
      }
      for (var key in result) {
        if (result[key] === min) {
          name = key;
        }
      }
      that.nearNanny['firstName'] = that.nani[name]['firstName'];
      that.nearNanny['phoneNumber'] = that.nani[name]['phoneNumber'];
      /////////////////////////////////////////////////////
      // console.log(that.nani[name]['firstName'], that.nani[name]['phoneNumber'] ,"hellooooooooo")
      // console.log(nani[name].lat, nani[name].lng, min);
      var currentTime = new Date(new Date().getTime()).toLocaleTimeString();
      var Uuser = this.afAuth.auth.currentUser;
      console.log(Uuser.uid,'jwan');
      var rand = Math.ceil(Math.random()*10000000);
      firebase.database().ref('services/' + rand).set({
        nani_id : name,
        user_id : Uuser.uid,
        user_position : that.userPosition,
        start_time : currentTime
      });
      firebase.database().ref('active/' + rand).set({
        nani_id : name,
        user_id : Uuser.uid,
        user_position : that.userPosition,
        start_time : currentTime
      });
      var intervalFunc = setInterval(function timer() {
        if(name){
        // console.log("debugg");
          that.coordinates = {
            lat: that.nani[name].lat,
            lng: that.nani[name].lng
          };          
        }
        that.showDirectionAndDuration();
      }, 1000);
      console.log("The nearst nani: " + name +" It is" + Math.floor(min * 10) + " km" + " far from you")
      // alert(
      //   "The nearst nani:" +
      //     " " +
      //     name +
      //     " " +
      //     "It is" +
      //     " " +
      //     Math.floor(min * 10) +
      //     " km" +
      //     " " +
      //     "far from you"
      // );
    });
  }

  request() {
    this.findNani();
    this.isRequested = true;
  }

  // cancel() {
  //   this.isRequested = false;
  //   let that = this;
  //   function delay() {
  //     that.isCanceled = true;
  //     alert("time is done");
  //   }
  //   setTimeout(delay, 60000);
  // }
}

