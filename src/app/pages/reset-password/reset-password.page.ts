import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { DataService } from "./../../helper-services/param-data.service";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;

  public paramData: any = {};
  resetPasswordForm: FormGroup
  formSubmitted: any = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: PostProvider,
    private helperService: HelperProvider,
    private rxjsParam: DataService,
    public alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {
        validator: ResetPasswordPage.MatchPassword
      });
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.paramData = JSON.parse(params.special);
        this.resetPasswordForm.controls['email'].setValue(this.paramData.EmailID);
      }
      console.log(this.paramData);
    });
  }

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      console.log('false');
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    } else {
      console.log('true');
      return null
    }
  }

  onResetPasswordSubmit() {
    event.preventDefault();
    this.formSubmitted = true;

    if (this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value); // Process your form
      this.doResetPassword();      
    }
  }

  doResetPassword() {
    let data: any = {
      EmailID: this.paramData.EmailID,
      Password: this.resetPasswordForm.value.password
    }
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.RESET_PASSWORD, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res) {
        if (res.code == 1001) {
          this.helperService.dismissLoader();
          this.navigateToLogin();
        } else {
          this.erroHandler.showError(res.message);
        }
      }
    }, error => {      
      this.helperService.dismissLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  async navigateToLogin(){
    const alert = await this.alertController.create({
      header: 'Reset successful !!',
      message: 'You have successfully reset your password. Login with your new password.',
      buttons: [ {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }

}
