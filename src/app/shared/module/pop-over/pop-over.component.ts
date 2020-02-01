import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
@Component({
  selector: 'app-pop-over',
  templateUrl: './pop-over.component.html',
  styleUrls: ['./pop-over.component.scss'],
})
export class PopOverComponent implements OnInit {
  userData: any = {};

  constructor(
    private navCtrl: NavController,
    private router: Router,
    public popoverCtrl: PopoverController,
    private service: PostProvider,
    private googlePlus: GooglePlus
  ) { 
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() { }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  async navigateToMyConnection() {
    await this.popoverCtrl.dismiss();
    this.router.url;
    this.router.navigate(['/my-connections/']);
  }

  async navigateToMyProfile() {
    this.router.url
    await this.popoverCtrl.dismiss();
    this.router.navigate(['/my-profile/']);
  }

  async navigateToSettings() {
    await this.popoverCtrl.dismiss();
    this.router.navigate(['/settings/']);
  }
  async navigateToFAQ(){
    await this.popoverCtrl.dismiss();
    this.router.navigate(['/faq/']);
  }

  async navigateToLogin() {
    let data = {
      UserId: this.userData.UserID
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.LOGOUT_USER, data).subscribe((res: any) => {
      if (res.code == 1001) {        
        this.googlePlus.logout().then(res => console.log(res))
          .catch(err => console.error(err));          
      }
      localStorage.removeItem('contactData');
      localStorage.removeItem('signUp');
      localStorage.removeItem('zuck-stories-seenItems');
      localStorage.removeItem('searchpopup');
      this.navCtrl.navigateRoot('/login-signup');
    }, error => {
    });
    await this.popoverCtrl.dismiss();
  }
}
