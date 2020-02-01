import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { DataService } from "./../../helper-services/param-data.service";

import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;

  userData: any = {};
  radioOptions: any = {
    UserId: '',
    FamilyStaus: true,
    FriendsStaus: true,
    CoWorkersStaus: true,
    AcquaintancesStaus: true,
    AllCategory: true
  }

  constructor(private location: Location,
    private service: PostProvider,
    public alertController: AlertController,
    private helperService: HelperProvider,
    public popoverCtrl: PopoverController,
    private paramData: DataService,
    private navCtrl: NavController,
    private googlePlus: GooglePlus,
    private router: Router) {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
    this.getUserStatus();
  }

  getUserStatus() {
    let data = {
      UserId: this.userData.UserID
    }
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_USER_PRIVACY_DETAILS, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        let data = JSON.parse(res.data).UserPrivacyDetails[0];
        this.radioOptions.FamilyStaus = data.FamilyStaus;
        this.radioOptions.FriendsStaus = data.FriendsStaus;
        this.radioOptions.CoWorkersStaus = data.CoWorkersStaus;
        this.radioOptions.AcquaintancesStaus = data.AcquaintancesStaus;
        this.radioOptions.AllCategory = data.AllCategory;
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }
  async changeStatus(val, cat) {
    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'Are you sure want to change your privacy setting?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            //this.radioOptions.FamilyStaus = false;
          }
        }, {
          text: 'Yes',
          handler: () => {
            if (cat == 'family') {
              //this.radioOptions.FamilyStaus = true;
              this.submitClicked(1, val);
            }
            if (cat == 'friends') {
              //this.radioOptions.FriendsStaus = true;
              this.submitClicked(2, val);
            }
            if (cat == 'acquaintance') {
              //this.radioOptions.AcquaintancesStaus = true;
              this.submitClicked(4, val);
            }
            if (cat == 'coworkers') {
              //this.radioOptions.CoWorkersStaus = true;
              this.submitClicked(3, val);
            }
            if (cat == 'allcategory') {
              //this.radioOptions.AllCategory = true;
              this.submitClicked(5, val);
            }
          }
        }
      ]
    });

    await alert.present();

  }

  submitClicked(code, status) {
    this.radioOptions.UserId = this.userData.UserID;
    let data =
    {
      UserId: this.userData.UserID,
      Categorycode: code,
      Staus: status
    }


    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.UPDATE_PRIVACY_SETTING, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.getUserStatus();
        this.erroHandler.showErrorToast('Setting updated successfully.');
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }


  async deleteMyAccount() {
    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'Are you sure want to delete your account from Charactify?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            let obj = {
              UserID: this.userData.UserID
            }
            this.service.callServiceFunction(ServicesConstant.USER_MGMT.DELETE_ACCOUNT, obj).subscribe((res: any) => {
              if (res.code === 1001) {
                this.erroHandler.showErrorToast('Account removed successfully.');
                this.googlePlus.logout().then(res => console.log(res))
                  .catch(err => console.error(err));
                localStorage.removeItem('contactData');
                localStorage.removeItem('signUp');
                localStorage.removeItem('zuck-stories-seenItems');
                localStorage.removeItem('searchpopup');                
                this.navCtrl.navigateRoot('/login-signup');
              } else {
                this.erroHandler.showErrorToast(res.message, 'error');
              }
            }, error => {
              this.erroHandler.showErrorToast(error.error.data, 'error');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  navigateBack() {
    this.location.back();
  }

}
