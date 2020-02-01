import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss'],
})
export class ErrorHandlerComponent implements OnInit {

  message: any = '';
  show: any = false;
  constructor(public toastController: ToastController) { }

  ngOnInit() { }

  showError(error) {    
      this.message = error;
      this.show = true;    
  }

  showErrorToast(message, type?) {    
    this.toastController.create({
        message: message,
        duration: 2000,
        animated: true,
        showCloseButton: true,
        closeButtonText: "OK",       
        position: "bottom",
        color: type == 'error' ? "danger" : "dark",
      }).then((obj) => {
        obj.present();
      });

  }

  showErrorToastWithCallback(message, type?) {    
    this.toastController.create({
      message: message ? message : 'An server error occured.',      
      animated: true,      
      closeButtonText: "OK",
      cssClass: type == 'error' ? "custom-toast-error" : "custom-toast",
      position: type == 'error' ? "middle" : "top"
    }).then((obj) => {
      obj.present();
    });
}

  manageError(errorCode) {
    switch (errorCode) {
      case 1002: {
        return 'An server error occured.';
      }
      case 1003: {
        return 'An server error occured.';
      }
      case 1006: {
        return 'You already have an account with us. Try login with your E-mail.';
      }
      case 1007: {
        return 'Invalid password.';
      }
      case 1008: {
        return 'In valid data.';
      }
      default: {
        return 'An server error occured.';
      }
    }
  }

  

}
