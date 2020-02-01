import { Injectable } from '@angular/core';
import { LoadingController, AlertController, Events, ToastController } from '@ionic/angular';

@Injectable()

export class HelperProvider {
  isLoading = false;

  constructor(
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    private toastCtrl: ToastController
  ) { }

  /** 
      * @method Loading controllers
      * Load on each http requests 
      */

  async showLoader() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent',
      cssClass: 'custom-loading',
      backdropDismiss: false,
      keyboardClose: true,
      mode: 'ios'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoader() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  deepClone(obj) {
    let stringfy = JSON.stringify(obj);
    let copiedData = JSON.parse(stringfy);
    return copiedData;
  }

}
