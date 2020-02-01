import { Component } from '@angular/core';
import { ContactDataService } from "./helper-services/contacts-provider.service";
import { Router } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { Device } from '@ionic-native/device/ngx';
import { ServicesConstant } from './api-provider/end-points';
import { PostProvider } from './api-provider/api.services';
import { HelperProvider } from './helper-services/helper.services';
import { DataService } from "./helper-services/param-data.service";
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  previousStatus: any;
  pushClicked = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private network: Network,
    public toastController: ToastController,
    private contactService: ContactDataService,
    private fcm: FCM,
    private device: Device,
    private router: Router,
    private service: PostProvider,
    private helperService: HelperProvider,
    private navCtrl: NavController,
    private paramData: DataService
  ) {
    this.initializeApp();
    const obj = {
      deviceToken: '',
      devicePlatform: ''
    };
    localStorage.setItem('deviceDetails', JSON.stringify(obj));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getPushToken();
      const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.toastController.create({
          message: 'You are appear to be offline. Please try again!.',
          showCloseButton: true
        }).then((res) => {
          res.present();
        });
      });
      // watch network for a connection
      const connectSubscription = this.network.onConnect().subscribe(() => {
      });
      this.statusBar.styleDefault();
        this.splashScreen.hide();
    });
  }

  getPushToken() {
    this.fcm.getToken().then(token => {
      const obj: any = {
        deviceToken: token,
        devicePlatform: this.device.platform
      };
      console.log(JSON.stringify(obj));
      localStorage.setItem('deviceDetails', JSON.stringify(obj));
    });

    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
        if (localStorage.getItem('signUp')) {
          const userData = JSON.parse(localStorage.getItem('signUp'));
          if (userData.Isselfrated) {
            setTimeout(() => {
              this.navCtrl.navigateRoot('/tabs/notifications');
            }, 1600);
          }
        }
      } else {
        console.log("Received in foreground");
        localStorage.setItem('push-notification', 'true');
        this.paramData.changeNotificationMsg(true);
      };
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      const obj: any = {
        deviceToken: token,
        devicePlatform: this.device.platform
      };
      console.log(JSON.stringify(obj));
      localStorage.setItem('deviceDetails', JSON.stringify(obj));
      this.sendPushToken();
    });
  }

  sendPushToken() {
    const deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
    const obj = JSON.parse(localStorage.getItem('signUp'));
    const data: any = {
      UserId: obj.UserID,
      usertoken: deviceDetails.deviceToken,
      device: deviceDetails.devicePlatform
    };
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.SEND_PUSH_TOKEN, data).subscribe((res: any) => {
      if (res.code != 1001) {
        console.log(res.message, 'error');
      }
    }, error => { });
  }
}