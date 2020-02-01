import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
@Component({
  selector: 'app-home-walk',
  templateUrl: './home-walk-through.component.html',
  styleUrls: ['./home-walk-through.component.scss'],
})
export class NotificationWalkThroughComponent implements OnInit {

  constructor(
    private navCtrl: NavController, 
    private router: Router,
    public popoverCtrl: PopoverController,
    private googlePlus: GooglePlus
    ) { }

  ngOnInit() {}

  async navigateToMyConnection(){
    await this.popoverCtrl.dismiss();
    this.router.url;
    this.router.navigate(['/my-connections/']); 
  }

  async navigateToMyProfile(){
    this.router.url
    await this.popoverCtrl.dismiss();
    this.router.navigate(['/my-profile/']); 
  }

  async navigateToSettings(){
    await this.popoverCtrl.dismiss();
    this.router.navigate(['/settings/']); 
  }

  async navigateToLogin(){
    await this.popoverCtrl.dismiss();
    this.googlePlus.logout().then(res => console.log(res))
    .catch(err => console.error(err));
    this.navCtrl.navigateRoot('/login');
  }
}
