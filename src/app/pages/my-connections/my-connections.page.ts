import { Component, OnInit, ViewChild } from '@angular/core';
import { PopOverComponent } from './../../shared/module/pop-over/pop-over.component';
import { PopoverController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { DataService } from "./../../helper-services/param-data.service";
import { SendMsgModalPage } from "./send-msg-modal/send-msg-modal.page";
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-connections',
  templateUrl: './my-connections.page.html',
  styleUrls: ['./my-connections.page.scss'],
})
export class MyConnectionsPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;

  myConnectionList: any = [];
  userData: any = {};
  myConnectionPaginitation: any = {
    UserID: 0,
    pageNo: 0,
    pageSize: 10
  }
  enableScrollEvent: Boolean = true;
  constructor(
    private location: Location,
    private service: PostProvider,
    public alertController: AlertController,
    private helperService: HelperProvider,
    public popoverCtrl: PopoverController,
    private paramData: DataService,
    private router: Router,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.getConnectionsList();
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  getConnectionsList() {
    this.myConnectionPaginitation.UserID = this.userData.UserID;
    this.myConnectionPaginitation.pageNo = this.myConnectionPaginitation.pageNo + 1;
    if (this.enableScrollEvent) {
      if (this.myConnectionPaginitation.pageNo == 1) {
        this.helperService.showLoader();
      }
      this.service.callServiceFunction(ServicesConstant.USER_MGMT.MY_CONNECTIONS, this.myConnectionPaginitation).subscribe((res: any) => {

        if (this.myConnectionPaginitation.pageNo == 1) {
          this.helperService.dismissLoader();
        }
        if (res.code == 1001) {
          let response = JSON.parse(res.data).Connections;
          if (!response.length) {
            this.enableScrollEvent = false;
          } else {
            response.forEach(element => {
              this.myConnectionList.push(element)
            });
          }          
        } else {
          this.erroHandler.showErrorToast(res.message, 'error');
        }
      }, error => {
        this.erroHandler.showErrorToast(error.error.data, 'error');
        if (this.myConnectionPaginitation.pageNo == 1) {
          this.helperService.dismissLoader();
        }        
      });
    }
  }

  async removeConnection(connectionid, i) {

    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'Are you sure want to remove this connection?',
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
            let obj = {
              connectionid: connectionid
            }
            this.service.callServiceFunction(ServicesConstant.USER_MGMT.REMOVE_CONNECTION, obj).subscribe((res: any) => {
              if (res.code === 1001) {
                this.myConnectionList.splice(i, 1);
              } else {
                this.erroHandler.showErrorToast(res.message, 'error');
              }
            }, error => {
              this.erroHandler.showErrorToast(error.error.data, 'error');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showPopOver(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopOverComponent,
      mode: 'ios',
      animated: true,
      event: ev,
    });
    return await popover.present();
  }

  charactify(selectedFriend) {
    this.paramData.changeMessage(selectedFriend);
    this.router.url;
    this.router.navigate(['/others-rating']);
  }

  navigateToProfile() {
    this.router.navigate(['/my-profile']);
  }

  performMute(item) {
    let data = {
      UserID: this.userData.UserID,
      ConnectionId: item.ConnectionID,
      mute: item.IsMute ? 0 : 1
    }    
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.CHANGE_MUTE_STATUS, data).subscribe((res: any) => {      
      if (res.code == 1001) {
        item.IsMute = item.IsMute ? 0 : 1;        
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');      
    });
  }

  naviagetToFriendshipPage(item) {
    let param = {
      id: item.ToUserID
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/frienship'], navigationExtras);
  }

  naviagetToOtherProfilePage(item) {
    let param = {
      id: item.ToUserID,
      FirstName: item.firstname,
      LastName: item.lastname
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/other-home'], navigationExtras);
  }


  async sendMessagePopUp(item) {
    const alert = await this.alertController.create({
      header: `Message to ${item.firstname}`,
      cssClass: 'message-pop',
      inputs: [
        {
          name: 'message',
          type: 'text',
          placeholder: 'Your message'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (e) => {
            this.sendMessageToConnection(item, e);
          }
        }
      ]
    });

    await alert.present();
  }

  sendMessageToConnection(item, msg) {
    let data = {
      FromUserID: this.userData.UserID,
      ToUserID: item.ToUserID,
      message: msg

    }    
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.SEND_MSG, data).subscribe((res: any) => {      
      if (res.code == 1001) {        
        this.erroHandler.showErrorToast('Your message sent successfully.');
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');      
    });
  }

  async sendMsg(item){
    const modal = await this.modalController.create({
      component: SendMsgModalPage,      
      componentProps: {
        'selectedItems': item
      }
    }); 
    modal.onDidDismiss()
      .then((data: any) => {
        if (data.data) {
          if (data.data.description) {           
            this.sendMessageToConnection(item, data.data.description);
          }
        }
      });
    return await modal.present();
  }

  navigateBack(){
    this.location.back();
  }

}
