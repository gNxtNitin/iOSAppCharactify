import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { DataService } from "./../../helper-services/param-data.service";
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;

  forgotPasswordForm: FormGroup
  formSubmitted: any = false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private service: PostProvider,
    private formBuilder: FormBuilder,
    private helperService: HelperProvider,
    private paramData: DataService
  ) {
    this.forgotPasswordForm = formBuilder.group({
      EmailID: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      type: ['reset']
    });
  }

  ngOnInit() {
  }

  goToVerification() {
    this.router.navigateByUrl('/otp-verification');
  }

  onForgotPasswordSubmit() {
    event.preventDefault();
    this.formSubmitted = true;
    if (this.forgotPasswordForm.valid) {
      this.doForgotPassword();
    }
  }

  doForgotPassword() {
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.FORGOT_PASSWORD, this.forgotPasswordForm.value).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res) {
        if (res.code != 1001) {
          if (res.data == "Invalid EmailID") {
            this.erroHandler.showError('E-mail not registered. Please try with another E-mail ID.');
          } else {
            this.erroHandler.showError(res.message);
          }
        } else {
          let data: any = {
            userEmailID: this.forgotPasswordForm.controls['EmailID'].value,
            comingFrom: 'forgot-password'
          }
          let navigationExtras = {
            queryParams: {
              special: JSON.stringify(data)
            }
          };          
          this.router.navigate(['/otp-verification/'], navigationExtras);
        }
      }
    }, error => {
      this.helperService.dismissLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

}
