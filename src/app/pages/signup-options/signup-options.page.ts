import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { NavController, Platform } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';

declare var window: any;

@Component({
  selector: 'app-signup-options',
  templateUrl: './signup-options.page.html',
  styleUrls: ['./signup-options.page.scss'],
})
export class SignupOptionsPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  isIOS: boolean;
  constructor(
    private router: Router,
    private googlePlus: GooglePlus,
    private service: PostProvider,
    private helperService: HelperProvider,
    private navCtrl: NavController,
    private fb: Facebook,
    private pl: Platform
  ) { 
    if (this.pl.is("ios") || this.pl.is("ipad") || this.pl.is("iphone")) {
      this.isIOS = true;
    }
  }

  ngOnInit() {

  }

  goToSignUp() {
    this.router.navigateByUrl('/email-signup');
  }

  goToSignIn() {
    this.router.navigateByUrl('/login-signup');
  }

  signUpUsingGoogle() {    
    this.helperService.showLoader();
    this.googlePlus.login({})
      .then((res) => {
        this.helperService.dismissLoader();
        console.log(res);
        this.createPayLoadData(res, 'GM');
      })
      .catch((err) => {
        this.helperService.dismissLoader();
        console.error(err);
      });
  }

  signUpUsingFacebook() {    
    this.fb.getLoginStatus().then((res) => {      
      if (res.status === 'connected') {
        // Already logged in to FB so pass credentials to provider (in my case firebase)
        this.fb.api(
          `me/?fields=id,
          name,
          first_name,
          last_name,
          email,
          picture.width(720).height(720).as(picture_large)`,
          [
            'public_profile',
            'email']
        ).then(apires => {          
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
                console.log(JSON.stringify(apires));                
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

  signUpUsingApple() {
    console.log('signing using apple');
    if (window.cordova) {
      window.cordova.plugins.SignInWithApple.signin(
        { requestedScopes: [0, 1] },
        (success: any) => {
          console.log('apple login success response = ', JSON.stringify(success));
          localStorage.setItem('appleResponse', JSON.stringify(success));
          let payload: any = {
            EmailId: success.email,
            UserName: success.email,
            Password: "",
            FirstName: success.fullName.givenName,
            LastName: success.fullName.familyName,
            UserProfilePic: "",
            CreatedVia: 'Apple',
            PhoneNo: "",
            UniqueID: success.user
          }
          this.doSignUp(payload);
        },
        (err: any) => {
          console.log('apple signing error = ', err);
        }
      )
    }
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
        PhoneNo: "",
        UniqueID: response.id
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
        PhoneNo: "",
        UniqueID: response.userId
      }
    }
    this.doSignUp(data);
  }

  checkUserStatusAndNavigate(res) {
    let item = JSON.parse(res.data);
    localStorage.setItem('signUp', res.data);
    if (res.code == 1001) {
      if (!item.Isselfrated) {        
        this.navCtrl.navigateRoot('/accept-terms-conditions');
      } else {
        this.navCtrl.navigateRoot('/tabs/feed');
      }
    } else {
      this.erroHandler.showErrorToast(item.message, 'error');
    }
  }

}
