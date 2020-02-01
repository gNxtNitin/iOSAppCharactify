import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { NavController, AlertController } from '@ionic/angular';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { DataService } from "./../../helper-services/param-data.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  @ViewChild('ngOtpInput') ngOtpInput: any;
  otpArray: any = ['', '', '', ''];
  public enableSubmitBtn: boolean = true;
  public inputOtp: any = '';
  public paramData: any = {};
  otp: string;
  

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private navCtrl: NavController,
    public alertController: AlertController,
    private service: PostProvider,
    private helperService: HelperProvider,
    private rxjsParam: DataService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.paramData = JSON.parse(params.special);
      }
      console.log(this.paramData);
    });

    var temp = this;
    $(function () {
      $(".otp").keyup(function (e: any) {
        if ((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)) {
          e.target.value = String.fromCharCode(e.which);
          temp.otpArray[Number(e.target.id)] = e.target.value;
          eventCaller();
          $(e.target).next('.otp').focus();
        } else if (e.which == 8) {
          e.target.value = String.fromCharCode(e.which);
          temp.otpArray[Number(e.target.id)] = '';
          eventCaller();
          $(e.target).prev('.otp').focus();
        }
      });
    });

    function eventCaller() {
      var flag = true;
      for (var i = 0; i <= 6; i++) {
        if (temp.otpArray[i] == '') {
          flag = false;
          temp.enableSubmitBtn = false;
          temp.inputOtp = '';
          return;
        } else {
          flag = true;
        }

      }
      if (flag) {
        temp.inputOtp = '';
        temp.otpArray.forEach((item) => {
          temp.inputOtp = temp.inputOtp + item;
        })
        temp.enableSubmitBtn = true;
      } else {
        temp.inputOtp = '';
        temp.enableSubmitBtn = false;
      }
    }
  }

  ngOnInit() {
    if (this.paramData.comingFrom == 'email-signup') {
      this.doForgotPassword();
    }
  }

  onOtpChange(otp) {
    this.otp = otp;
    if(this.otp.length == 4){
      this.enableSubmitBtn = false;
    } else{
      this.enableSubmitBtn = true;
    }
  }

  goToResetPassword() {
    this.router.navigateByUrl('/reset-password');
  }

  verifyOtp() {
    let data: any = {
      EmailID: this.paramData.userEmailID,
      VerificationCode: this.otp
    }
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.VERIFY_OTP, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res) {
        if (res.code != 1001) {          
          this.erroHandler.showError(res.message);
        } else {
          if (this.paramData.comingFrom == 'forgot-password') {
            let navigationExtras = {
              queryParams: {
                special: JSON.stringify(data)
              }
            };
            this.router.navigate(['/reset-password'], navigationExtras);
            console.log(data);
          } else {
            this.sendPushToken();
            this.navCtrl.navigateRoot('/accept-terms-conditions');
          }
        }
      }
    }, error => {      
      this.helperService.dismissLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  sendPushToken() {
    let user = JSON.parse(localStorage.getItem('signUp'));
    let deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
    let data: any = {
      UserId: user.UserID,
      usertoken: deviceDetails.deviceToken,
      device: deviceDetails.devicePlatform
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.SEND_PUSH_TOKEN, data).subscribe((res: any) => {
      if (res.code != 1001) {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  doForgotPassword() {
    this.helperService.showLoader();
    const obj = {
      "EmailID": this.paramData.userEmailID,
      "type": this.paramData.comingFrom == 'email-signup' ? "otp-verification" : 'reset'
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.FORGOT_PASSWORD, obj).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res) {
        if (res.code == 1001) {
          this.erroHandler.showErrorToast('OTP has been sent successfully on your registered E-mail Id.');
        } else {
          this.erroHandler.showError(res.message);
        }
      }
    }, error => {
      this.helperService.dismissLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  reSendOtp() {   
    this.erroHandler.showError('');
    this.ngOtpInput.setValue('');
    this.doForgotPassword();
  }


  navigateBack(){
    if (this.paramData.comingFrom == 'email-signup') {
        this.askNavigatePermission();
    }else{
      this.location.back();
    }
  }


  async askNavigatePermission() {

    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'You already have a signup request, which is pending for OTP verification. Are you sure want to go back without completing the signup process?',
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
            localStorage.removeItem('signUp');
            this.router.navigate(['/login-signup']);
          }
        }
      ]
    });

    await alert.present();
  }
}
