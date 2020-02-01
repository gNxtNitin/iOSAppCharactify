import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
import { HelperProvider } from './../../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { DataService } from "./../../../helper-services/param-data.service";
import { PopOverComponent } from './../../../shared/module/pop-over/pop-over.component';
import { NotificationWalkThroughComponent } from './walk-through/home-walk-through.component';
import { SendMsgModalPage } from "./send-msg-modal/send-msg-modal.page";

@Component({
  selector: 'app-tab-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  connectionNotificationList: any = [];
  routerSubscription: any;
  userData: any = {};
  paginatation: any = {
    pageSize: 10,
    pageNo: 1
  }

  constructor(
    private service: PostProvider,
    private helperService: HelperProvider,
    private paramData: DataService,
    public alertController: AlertController,
    private router: Router,
    public popoverCtrl: PopoverController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.routerWatch();
    setTimeout(() => {
      let selector = document.getElementById('notification-pop');
      selector.click();
    }, 1000);
  }


  routerWatch() {
    this.routerSubscription = this.router.events.subscribe(
      (event: NavigationEnd) => {
        if (event instanceof NavigationEnd) {
          if (event.url == '/tabs/notifications') {                        
            setTimeout(() => {
              let selector = document.getElementById('notification-pop');
              selector.click();
            }, 1000);
          }
        }
      }
    );
  }

  ionPageWillLeave() {
    this.routerSubscription.unsubscribe();
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.connectionNotificationList = [];
    this.paginatation.pageNo = 1;
    this.getNotificationList('showLoader');
  }

  getNotificationList(showLoader?) {
    if (showLoader) {
      this.helperService.showLoader();
    }
    let data = {
      UserID: this.userData.UserID,
      pageNo: this.paginatation.pageNo,
      pageSize: this.paginatation.pageSize
    }
    this.service.callServiceFunction(ServicesConstant.NOTIFICATION.GET_NOTIFICATIONS, data).subscribe((res: any) => {
      if (showLoader) {
        this.helperService.dismissLoader();
      }
      if (res.code == 1001) {
        this.paginatation.pageNo = this.paginatation.pageNo + 1;
        this.customizeResponse(JSON.parse(res.data).ConnectionNotification);
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      if (showLoader) {
        this.helperService.dismissLoader();
      }
    });
  }

  customizeResponse(list) {
    list.forEach(element => {
      if (element.type == 'RWA') {
        if (element.score % 1 == 0) {
          element.score = element.score + '.0';
        }
      }
      this.connectionNotificationList.push(element);
    });
    let selector = document.getElementById('initilizer');
      selector.click()
  }

  approveRequest(itemObj, status, index) {
    this.helperService.showLoader();
    let obj = {
      RequestID: itemObj.enid,
      RequestType: itemObj.type,
      status: status,
      UserID: this.userData.UserID
    }
    this.service.callServiceFunction(ServicesConstant.NOTIFICATION.APPROVE_REQUEST, obj).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.connectionNotificationList = [];
        this.paginatation.pageNo = 1;
        this.getNotificationList();
        if(status == 'Accepted'){
          this.askForSelfChartify(itemObj);
        }
        this.connectionNotificationList.splice(index, 1);
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }
  async askForSelfChartify(item){
    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'You have just accepted the connection request from ' + item.firstname + '. Would you like to charactify ' + item.firstname + ' now?',
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
            this.sentToCharactifyScreen(item)
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

  navigateToHome() {
    this.router.navigateByUrl('/tabs/feed');
  }

  naviagetToOtherRatingPage(item) {
    let param = {
      id: item.CreatedBy,
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

  naviagetToNotificationDetailPage(item) {
    if (item.FeedId) {
      let param = {
        id: item.FeedId
      }
      let navigationExtras = {
        queryParams: {
          special: JSON.stringify(param)
        }
      };
      this.router.navigate(['/notification-detail'], navigationExtras);
    } else {
      if(item.type == 'CA' || item.type == 'NCA'){
        this.sentToCharactifyScreen(item);
      } 
      if(item.type == 'CHAT'){
        this.sendMsg(item);

      }     
    }
  }


  sentToCharactifyScreen(item) {
    let obj = {
      FromUserID: this.userData.UserID,
      ToUserID: item.CreatedBy
    }
    this.service.callServiceFunction(ServicesConstant.NOTIFICATION.GET_CHARACTIFY_STATUS, obj).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        if(res.data == "false"){
          item.CRID = 0;
          item.ToUserID = item.CreatedBy;
          this.paramData.changeMessage(item);
          this.router.navigate(['/others-rating']);
        } else{
          this.showAlreadyCharactifyDilog(item)
        }
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });    
  }

  async showAlreadyCharactifyDilog(item){
    const alert = await this.alertController.create({
      header: `Already Charactified`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'You have already Charactified ' + item.firstname + '.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }





  sendMessageToConnection(item, msg) {
    let data = {
      FromUserID: this.userData.UserID,
      ToUserID: item.CreatedBy,
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





//will be removed later
  async showNotificationPopOverOverlay(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationWalkThroughComponent,
      mode: 'ios',
      animated: true,
      event: ev,
      cssClass: 'walkThrough'
    });
    return await popover.present();
  }
  
}
