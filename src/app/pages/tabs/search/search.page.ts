import { Component, OnInit, ViewChild } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { ModalController, PopoverController, AlertController, IonSlides, IonContent, IonInfiniteScroll } from '@ionic/angular';
import { HelperProvider } from './../../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
import { DataService } from "./../../../helper-services/param-data.service";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ContactDataService } from "./../../../helper-services/contacts-provider.service";
import { PopOverComponent } from './../../../shared/module/pop-over/pop-over.component';
import { SendContactMsgModalPage } from './send-contact-msg-modal/send-contact-msg-modal.page';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-tab-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage {

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;

  showInitialPopUp: any = true;

  isPageLoad: any = 0;
  searchFriends = 0;
  totalContactList: any = [];
  isMultiSelect: Boolean = false;
  multiSelectItems: any = [];
  startLazyLoading: Boolean = false;
  showBackDrop: any = false;


  cloneEmailFriendList: any = {
    list: [],
    itemParPage: 10,
    currentPage: 1
  };

  searchFindList: any = [];
  initialServerEmailLst: any = [];

  emailList: any = [];
  emailQuery: any = '';
  userData: any = {};
  constructor(
    private router: Router,
    public modalController: ModalController,
    public alertController: AlertController,
    public popoverCtrl: PopoverController,
    private contactProvider: ContactDataService,
    private socialSharing: SocialSharing,
    private rxjsParam: DataService,
    private contacts: Contacts,
    private helperService: HelperProvider,
    private service: PostProvider) {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngAfterViewInit() {
    if (localStorage.getItem('contactData')) {
      this.showInitialPopUp = false;
      let cont = JSON.parse(localStorage.getItem('contactData'));
      this.cloneEmailFriendList.list = cont;
      this.startLazyLoading = true;
      this.loadEmailData();
      this.showFabMenu();
    }
  }

  ionViewDidEnter() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  getPhoneContact() {
    try {
      this.emailList = [];
      this.totalContactList = [];
      this.cloneEmailFriendList.list = [];
      this.emailQuery = '';
      this.helperService.showLoader();
      this.contacts.find(['displayName', 'photos', 'emails'], { filter: "", multiple: true, hasPhoneNumber: false }).then((list) => {
        this.helperService.dismissLoader();
        list.sort((a, b) => {
          const textA = a.name.formatted;
          const textB = b.name.formatted;
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.totalContactList = list;

        this.seperateEmailFromLocalConatct();
      },
        (error: any) => {
          this.helperService.dismissLoader();
          console.error('Error saving contact.', error)
        });
    } catch (err) {
      this.helperService.dismissLoader();
    }
  }


  seperateEmailFromLocalConatct() {
    this.totalContactList.forEach(element => {
      if (element.emails) {
        this.cloneEmailFriendList.list.push(
          {
            emailid: element.emails[0].value,
            name: element.name.formatted
          });
      }
    });

    this.filterEmailDataFromServer();
  }

  filterEmailDataFromServer() {
    this.helperService.showLoader();
    let tempList: any = [];
    this.cloneEmailFriendList.list.forEach(element => {
      tempList.push(element);
    });
    let data = {
      UserID: this.userData.UserID,
      emails: tempList
    }
    this.userData.UserID;
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.EMAIL_SEARCH_LIST, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        let codeList: any = [];
        let item: any = JSON.parse(res.data);
        if (item.SearchList) {
          item.SearchList.forEach(element => {
            element.isChecked = false;
            element.Status = element.Status == "True" ? true : false;
            element.sentStatus = false;
            element.profilePic = element.UserProfilePic;
          });
          this.cloneEmailFriendList.list = item.SearchList;
          localStorage.setItem('contactData', JSON.stringify(this.cloneEmailFriendList.list));
          this.emailList = [];
          this.startLazyLoading = true;
          this.cloneEmailFriendList.currentPage = 1;
          this.loadEmailData();
        } else {
          this.showInitialPopUp = false;
        }

        this.showInitialPopUp = false;
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }

  findItems(value, keys: string, term: string) {
    if (!term) return value;
    return (value || []).filter(item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'i').test(item[key])));
  }

  emailSearchChange() {
    let result = this.findItems(this.cloneEmailFriendList.list, "name,email", this.emailQuery);
    if (result.length == 0) {
      this.searchFindList = [];
    } else {
      this.searchFindList = result.slice(0, 15);
    }
  }
























  loadData(event) {
    if (this.startLazyLoading) {
      this.loadEmailData();
    }
  }
  loadEmailData() {
    let begin = ((this.cloneEmailFriendList.currentPage - 1) * this.cloneEmailFriendList.itemParPage);
    let end = begin + this.cloneEmailFriendList.itemParPage;
    let list = this.cloneEmailFriendList.list.slice(begin, end);
    list.forEach(element => {
      this.emailList.push(element);
    });
    if (list.length) {
      this.cloneEmailFriendList.currentPage = this.cloneEmailFriendList.currentPage + 1;
    } else {
      this.startLazyLoading = false;
    }

  }


  proceedToRequestForAdd(item) {

    //console.log(item);
    this.helperService.showLoader();
    let data: any = {
      FromUserID: this.userData.UserID,
      ToUserID: item.UserID
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_TO_MY_CONNECTION_REQUEST, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.cloneEmailFriendList.list.forEach(element => {
          if (element.email == item.email) {
            element.sentStatus = true;
          }
        });

        this.erroHandler.showErrorToast('Add request sent successfully.');
        item.sentStatus = true;
        let selector = document.getElementById('initilizer');
        selector.click();
        localStorage.setItem('contactData', JSON.stringify(this.cloneEmailFriendList.list));
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.helperService.dismissLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');

    });
  }

  async requestForAdd(item) {
    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'By connecting this user, you are authorizing this user to Charactify You.',
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
            if (item != 'FB') {
              this.proceedToRequestForAdd(item);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  requestForInvite(item) {
    //console.log(item);
    this.helperService.showLoader();
    let data = [{
      InviteVia: "EM",
      InviteViaID: this.userData.UserID,
      InvitedName: item.name,
      InvitedEmailID: item.email,
      InviteReSent: "0"
    }]
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.INVITE_USER, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('An invite sent successfully.');
        item.sentStatus = true;
        this.cloneEmailFriendList.list.forEach(element => {
          if (element.email == item.email) {
            element.sentStatus = true;
          }
        });
        let selector = document.getElementById('initilizer');
        selector.click()
        localStorage.setItem('contactData', JSON.stringify(this.cloneEmailFriendList.list));
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }



  startSocialShare(item) {
    this.socialSharing.share('Install Charactify', 'From Store', null, 'https://play.google.com/store/apps/details?id=com.app.charactify');
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

  multiSelectCloseClicked() {
    this.isMultiSelect = false;
    this.multiSelectItems = [];
    this.cloneEmailFriendList.list.forEach(element => {
      element.isChecked = false;
    });
  }

  emailItemSelected(item) {
    let selectedData
    if (item.isChecked) {
      this.multiSelectItems.push(
        {
          InviteVia: "EM",
          InviteViaID: this.userData.UserID,
          InvitedName: item.name,
          InvitedEmailID: item.email,
          InviteReSent: "0"
        }
      )
    } else {
      let itemIndex;
      this.multiSelectItems.forEach((element, i) => {
        if (element.InvitedEmailID == item.email) {
          itemIndex = i;
        }
      });
      this.multiSelectItems.splice(itemIndex, 1);
    }
  }

  sentMultiSelectInvite() {
    this.helperService.showLoader();
    let data = [];
    // this.multiSelectItems.forEach(element => {
    //   data.push({
    //     InviteVia: "EM",
    //     InviteViaID: this.userData.UserID,
    //     InvitedName: element.InvitedName,
    //     InvitedEmailID: element.InvitedEmailID,
    //     InviteReSent: "0"
    //   })
    // });
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.INVITE_USER, this.multiSelectItems).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.emailList.forEach(list => {
          if (list.isChecked) {
            this.cloneEmailFriendList.list.forEach(clonElem => {
              if (clonElem.email == list.email) {
                clonElem.sentStatus = true;
              }
            });
            list.sentStatus = true;
          }
        });
        localStorage.setItem('contactData', JSON.stringify(this.cloneEmailFriendList.list));
        this.isMultiSelect = false;
        this.multiSelectItems = [];
        this.emailList.forEach(element => {
          element.isChecked = false;
        });
        this.erroHandler.showErrorToast('An invite sent successfully.');
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }

  selectAllInvite() {
    this.isMultiSelect = true;
    this.cloneEmailFriendList.list.forEach(element => {
      if (!element.UserID) {
        element.isChecked = true;
        this.multiSelectItems.push(
          {
            InviteVia: "EM",
            InviteViaID: this.userData.UserID,
            InvitedName: element.name,
            InvitedEmailID: element.email,
            InviteReSent: "0"
          }
        );
      }
    });

    //this.isMultiSelect = true;
  }



  async sendMessagePopUp(item) {
    const alert = await this.alertController.create({
      header: `Message to ${item.FirstName}`,
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
      ToUserID: item.UserID,
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

  async sendContactMsg(item) {
    const modal = await this.modalController.create({
      component: SendContactMsgModalPage,
      componentProps: {
        'selectedItems': item
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        if (data.data) {
          if (data.data.description) {
            // item.description = data.data.description;
            this.sendMessageToConnection(item, data.data.description);
          }
        }
      });
    return await modal.present();
  }


  navigateToHome() {
    this.router.navigateByUrl('/tabs/feed');
  }


  // temporaryCode
  routerSubscription: any;
  showFabMenu() {
    setTimeout(() => {
      let selector = document.getElementById('searchFabButton');
      selector.click();
    }, 1000);

  }

  ngOnInit() {

    this.routerWatch();
  }


  routerWatch() {
    this.routerSubscription = this.router.events.subscribe(
      (event: NavigationEnd) => {
        if (event instanceof NavigationEnd) {
          if (event.url == '/tabs/search') {
            this.showFabMenu();
          }
        }
      }
    );
  }

  ionPageWillLeave() {
    this.routerSubscription.unsubscribe();
  }
}
