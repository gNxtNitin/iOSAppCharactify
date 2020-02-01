import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { HelperProvider } from './../../helper-services/helper.services';
import { DataService } from "./../../helper-services/param-data.service";

@Component({
  selector: 'app-email-signup',
  templateUrl: './email-signup.page.html',
  styleUrls: ['./email-signup.page.scss'],
})
export class EmailSignupPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  emailSignUpForm: FormGroup
  formSubmitted: any = false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private service: PostProvider,
    private helperService: HelperProvider,
    public alertController: AlertController,
    private paramData: DataService
  ) {
    this.emailSignUpForm = formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: [''],
      UserName: [''],
      PhoneNo: [''],
      UserProfilePic: [''],
      EmailId: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)
      ])],
      Password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      CreatedVia: ['EM'],
      UniqueID: ['']
    }, {
      validator: EmailSignupPage.MatchPassword
    });
  }

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('Password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      console.log('false');
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    } else {
      console.log('true');      
     return null
    }
  }

  ngOnInit() {
  }

  goToSignUp() {
    this.router.navigateByUrl('/signup-options');
  }

  onEmailSignUpSubmit() {
    event.preventDefault();
    this.formSubmitted = true;

    if (this.emailSignUpForm.valid) {
      this.emailSignUpForm.controls['UserName'].setValue(this.emailSignUpForm.value.EmailId);
      console.log(this.emailSignUpForm.value);
      this.doSignUp();
    }
  }

  doSignUp() {
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.SIGN_UP, this.emailSignUpForm.value).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res) {
        this.checkUserStatusAndNavigate(res);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

  checkUserStatusAndNavigate(res) {
    let item: any;
    if (res.data) {
      item = JSON.parse(res.data);
    }
    if (res.code == 1001) {
      if (item.Isselfrated) {
        this.navigateToLogin();
      } else {
        localStorage.setItem('signUp', res.data);
        let data: any = {
          userEmailID: this.emailSignUpForm.controls['EmailId'].value,
          comingFrom: 'email-signup'
        }
        let navigationExtras = {
          queryParams: {
            special: JSON.stringify(data)
          }
        };
        this.router.navigate(['/otp-verification/'], navigationExtras);
      }
    } else if (res.code == 0) {
      this.navigateToLogin();
    } else {
      this.erroHandler.showErrorToast(item.message, 'error');
    }
  }

  async navigateToLogin() {
    const alert = await this.alertController.create({
      header: 'Already registered !!',
      mode:'ios',
      message: 'E-mail ID already registered. Please try to login with your password.',
      buttons: [{
        text: 'Ok',
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
