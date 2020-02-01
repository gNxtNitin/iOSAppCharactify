import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

declare const $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;

  loginForm: FormGroup;
  formSubmitted: any = false;
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private service: PostProvider,
    private formBuilder: FormBuilder,
    private helperService: HelperProvider,
    private googlePlus: GooglePlus,
    private fb: Facebook
  ) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      type: ['EM']
    });
  }

  ngOnInit() { }

  goToForgotPass() {
    this.router.navigateByUrl('/forgot-password');
  }

  navigateTohome() {
    this.navCtrl.navigateRoot('/lets-begin');
  }

  onLoginSubmit() {
    event.preventDefault();
    this.formSubmitted = true;

    if (this.loginForm.valid) {
      console.log(this.loginForm.value); // Process your form      
      this.doLogin();
    }
  }

  doLogin() {
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.DO_LOGIN, this.loginForm.value).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.checkUserStatusAndNavigate(res);
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

  signInUsingFacebook() {
    this.fb.getLoginStatus().then((res) => {
      if (res.status === 'connected') {
        // Already logged in to FB so pass credentials to provider (in my case firebase)
        this.fb.api('me/?fields=id,name,first_name,last_name,email,picture.width(720).height(720).as(picture_large)',
          ['public_profile', 'email']).then(apires => {
            this.createPayLoadData(apires, 'FB');
          }).catch((err) => {
            console.log('Error in profile info', err)
          });
      } else {
        // Not already logged in to FB so sign in
        this.fb.login(['public_profile', 'email'])
          .then((res: FacebookLoginResponse) => {
            console.log(JSON.stringify(res));
            this.fb.api('me/?fields=id,name,first_name,last_name,email,picture.width(720).height(720).as(picture_large)',
              ['public_profile', 'email']).then(apires => {
                this.createPayLoadData(apires, 'FB');
              }).catch((err) => {
                console.log('Error in profile info', err)
              });
          })
          .catch((e) => {
            console.log('Error logging into Facebook', e)
          });
      }
    });
  }

  signInUsingGoogle() {
    this.helperService.showLoader();
    this.googlePlus.login({})
      .then((res) => {
        this.helperService.dismissLoader();
        this.createPayLoadData(res, 'GM');
      })
      .catch((err) => {
        this.helperService.dismissLoader();
        console.error(err);
      });
  }

  createPayLoadData(response, type) {
    let data: any = {};
    if (type === 'FB') {
      data = {
        UserName: response.email,
        EmailId: response.email,
        Password: "",
        FirstName: response.first_name,
        LastName: response.last_name,
        UserProfilePic: response.picture_large.data.url,
        CreatedVia: type,
        PhoneNo: ""
      }
    } else {
      data = {
        UserName: response.email,
        EmailId: response.email,
        Password: "",
        FirstName: response.givenName,
        LastName: response.familyName,
        UserProfilePic: response.imageUrl,
        CreatedVia: type,
        PhoneNo: ""
      }
    }

    this.doSignUp(data);
  }

  doSignUp(payload) {
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.SIGN_UP, payload).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.checkUserStatusAndNavigate(res);
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.helperService.dismissLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  checkUserStatusAndNavigate(res) {
    let item = JSON.parse(res.data);
    localStorage.setItem('signUp', res.data);
    if (res.code == 1001) {
      this.sendPushToken(item.UserID);
      if (!item.Isselfrated) {
        this.navCtrl.navigateRoot('/accept-terms-conditions');
      } else {
        this.navCtrl.navigateRoot('/tabs/feed');
      }
    } else {
      this.erroHandler.showErrorToast(item.message, 'error');
    }
  }

  sendPushToken(UserID) {
    let deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
    let data: any = {
      UserId: UserID,
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
}
