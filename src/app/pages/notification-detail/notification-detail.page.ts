import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, PopoverController, ModalController, IonInfiniteScroll, IonVirtualScroll, ActionSheetController } from '@ionic/angular';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ReactionsComponent } from './reactions/reactions.component';
import { PostImageViewerPage } from './post-image-viewer/post-image-viewer.page';
import { ViewReactionsListPage } from './view-reactions-list/view-reactions-list.page';
import { ViewCommentsListPage } from './view-comment-list/view-comment-list.page';
import { UpdateFeedModalPage } from './update-feed-modal/update-feed-modal.page';
import { ShareModalPage } from './share-modal/share-modal.page';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DataService } from "./../../helper-services/param-data.service";
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-notification-detail',
  templateUrl: 'notification-detail.page.html',
  styleUrls: ['notification-detail.page.scss']
})
export class NotificationDetailPage {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  infiniteScrollActive: any;
  userData: any = {};
  feedList: any = [];
  enableScrollEvent: Boolean = true;
  feedPaginitation: any = {
    pageNo: 1,
    pageSize: 4,
    Story: 1
  }
  errorOccured: any = true;
  errorMsg: any = '';
  routerSubscription: any;
  paramData: any = {};
  constructor(
    private location: Location,
    public alertController: AlertController,
    public elementRef: ElementRef,
    public actionSheetController: ActionSheetController,
    private service: PostProvider,
    public modalController: ModalController,
    private helperService: HelperProvider,
    public popoverController: PopoverController,
    public popoverCtrl: PopoverController,
    private rxjsParam: DataService,
    private router: Router, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('signUp'));    

    this.route.queryParams.subscribe(params => {      
      if (params && params.special) {
        this.paramData = JSON.parse(params.special);
      }
    });
  }


  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.feedPaginitation.pageNo = 1;
    this.feedList = [];
    this.loadFeedData('');
  }

  checkMedia(e) {
    
  }


  loadFeedData(evnt: any, isRefresher?) {
    this.errorOccured = false;
    this.errorMsg = '';
    if (!evnt) {
      this.enableScrollEvent = true;
    } else {
      this.infiniteScrollActive = evnt;
    }
    if (isRefresher) {
      this.enableScrollEvent = true;
      this.feedPaginitation.pageNo = 1;
    }
    this.feedPaginitation.UserId = this.userData.UserID;
    let data = {
      FeedId: this.paramData.id
    }
    if (this.enableScrollEvent) {
      this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_FEED_RESPONSE_ON_FEED_ID, data).subscribe((res: any) => {
        if (res.code == 1001) {
          this.errorOccured = false;
          if (isRefresher == 'isRefresher') {
            this.feedList = [];
          }
          let list = JSON.parse(res.data);
          //enable tag menu

          list.forEach(element => {
            element.taggingslst.forEach(tag => {
              if (tag.Touserid == this.userData.UserID) {
                element.enableTagMenu = true;
              }
            });
          });
          
          if (!list.length) {
            this.enableScrollEvent = false;
            (event.target as HTMLInputElement).disabled = true
            if (this.feedPaginitation.pageNo == 1) {
              this.errorOccured = true;
              this.errorMsg = 'There is no feed. Start creating new feed.';
            }
          }
          list.forEach(element => {
            element.commentDec = '';

            if (element.feedType == 'Charactify') {
              let totalRating = 0;
              let averageRating = 0
              element.charactifyScores.forEach(elem => {
                elem.Score = parseInt(elem.Score);
                totalRating += elem.Score;
                averageRating = Number(totalRating / 10);
              });
              element.averageRating = averageRating;

            }
            this.feedList.push(element)
          });

          if (evnt) {
            evnt.target.complete();
          }
          this.feedPaginitation.pageNo = this.feedPaginitation.pageNo + 1;
        } else {
          if (evnt) {
            evnt.target.complete();
          }

          this.errorOccured = true;
          this.errorMsg = 'Unable to load feed data. An server error occured.';
          this.erroHandler.showErrorToast(res.message, 'error');
        }
      }, error => {
        if (evnt) {
          evnt.target.complete();
        }
        this.errorOccured = true;
        this.errorMsg = 'Unable to load feed data. An server error occured.';
        this.erroHandler.showErrorToast(error.error.data, 'error');
      });
    }
  }

  async showReactions(ev: any, item) {
    const popover = await this.popoverCtrl.create({
      component: ReactionsComponent,
      animated: true,
      event: ev,
      cssClass: 'custom-reaction-popover',
      keyboardClose: true
    });
    popover.onDidDismiss().then((result) => {
      if (result.data) {
        this.addReaction(result.data, item);
      }
    });;

    return await popover.present();
  }
  addReaction(obj, selectedFeed) {
    let data = {
      reactionID: 0,
      userID: this.userData.UserID,
      feedID: selectedFeed.feedID,
      reactionType: obj.id
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_REACTIONS, data).subscribe((res: any) => {
      if (res.code == 1001) {
        let data = JSON.parse(res.data)[0];
        selectedFeed.currentUserRection = obj.key;
        selectedFeed.noComments = data.noComments;
        selectedFeed.noRections = data.noRections;
        selectedFeed.userRectionsTypeLst = data.userRectionsTypeLst;
        selectedFeed.usercommentLst = data.usercommentLst;
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  addComment(obj) {
    let data = {
      userID: this.userData.UserID,
      feedID: obj.feedID,
      reactionType: "65",
      description: obj.commentDec
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_REACTIONS, data).subscribe((res: any) => {
      if (res.code == 1001) {
        let data = JSON.parse(res.data)[0];
        obj.commentDec = '';
        obj.noComments = data.noComments;
        obj.usercommentLst = data.usercommentLst;
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  async openImageViewerModal(item, index) {
    const modal = await this.modalController.create({
      component: PostImageViewerPage,
      componentProps: {
        'selectedItems': item,
        'selectedIndex': index
      }
    });
    modal.onDidDismiss()
      .then((data) => {

      });
    return await modal.present();
  }

  async viewReactionsListModal(item, reactionListitem) {
    if (item.noRections) {
      const modal = await this.modalController.create({
        component: ViewReactionsListPage,
        componentProps: {
          'selectedItems': reactionListitem
        }
      });
      modal.onDidDismiss()
        .then((data) => {

        });
      return await modal.present();
    }
  }

  async viewCommentListModal(items, item) {
    const modal = await this.modalController.create({
      component: ViewCommentsListPage,
      componentProps: {
        'selectedItems': item
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        if (data.data) {
          if (data.data.action == 'addComment') {
            item.commentDec = data.data.description;
            this.addComment(item);
          } else {
            item.usercommentLst = data.data.data.selectedItem.usercommentLst;
            item.noComments = data.data.data.selectedItem.noComments;
          }
        }
      });
    return await modal.present();
  }

  removeComment(selectedItem, newData) {
    selectedItem.commentDec = '';
    selectedItem.noComments = newData.noComments;
    selectedItem.usercommentLst = newData.usercommentLst;
  }

  async shareModal(item) {
    const modal = await this.modalController.create({
      component: ShareModalPage,
      cssClass: 'custom-share-modal',
      componentProps: {
        'selectedItems': item
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        if (data.data) {
          this.sharePost(item, data.data.description);
        }
      });
    return await modal.present();
  }

  sharePost(item, desc) {
    let data = {
      userID: this.userData.UserID,
      feedID: item.feedID,
      description: desc
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.SHARE_POST, data).subscribe((res: any) => {
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('Post has been shared successfully.');
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  goToNewGallery() {
    this.router.navigateByUrl('/add-story-gallery');
  }



  async pressEvent(selectedFeed, index) {
    if (selectedFeed.enableTagMenu) {
      this.removeTagMenuShow(selectedFeed, index);
    } else {
    const actionSheet = await this.actionSheetController.create({
      header: 'Feed post option',
      buttons: [{
        text: 'Delete',
        handler: () => {
          this.requestForDeleteFeed(selectedFeed, index)
        }
      }, {
        text: 'Edit',
        handler: () => {
          this.updateFeed(selectedFeed);
        }
      }]
    });
    await actionSheet.present();
  }
  }

  async removeTagMenuShow(selectedFeed, index) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Remove my tag from this feed.',
      buttons: [{
        text: 'Remove',
        handler: () => {
          this.removeTagSubmit(selectedFeed, index)
        }
      }]
    });
    await actionSheet.present();
  }

  removeTagSubmit(item, index) {
    let data = {
      UserId: this.userData.UserID,
      FeedId: item.feedID
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.REMOVE_TAG, data).subscribe((res: any) => {
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('Tag removed successfully.');
        item.taggingslst.forEach((element, index) => {
          if (element.Touserid == this.userData.UserID) {
            item.taggingslst.splice(index, 1);
            let selector = document.getElementById('initilizer');
            selector.click()
          }
        });
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    })
  }

  async requestForDeleteFeed(item, index) {
    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'Are you sure want to delete this post?',
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
              this.proceedDeleteFeed(item, index);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  proceedDeleteFeed(item, index) {
    let data = {
      FromUserID: this.userData.UserID,
      FeedId: item.feedID,
      IsDelete: 1
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.DELETE_FEED, data).subscribe((res: any) => {
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('Post has been deleted successfully.');
        this.feedList.splice(index, 1);
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }
  async updateFeed(item) {
    const modal = await this.modalController.create({
      component: UpdateFeedModalPage,
      componentProps: {
        'selectedItems': item
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        if (data.data) {
          if (data.data.action == 'updateFeed') {
            item.description = data.data.description;
            this.updateFeedComment(item);
          }
        }
      });
    return await modal.present();
  }

  updateFeedComment(item) {
    let data = {
      userID: this.userData.UserID,
      feedID: item.feedID,
      Description: item.description
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.UPDATE_FEED, data).subscribe((res: any) => {
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('Post has been updated successfully.');
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  naviagetToOtherRatingPage(item) {
    let param = {
      id: item.UserID,
      FirstName: item.FirstName,
      LastName: item.LastName
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/other-home'], navigationExtras);
  }

  naviagetToOtherRatingPageFromComment(item) {
    let param = {
      id: item.UserID,
      FirstName: item.Name,
      LastName: item.LastName
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/other-home'], navigationExtras);
  }

  navigateBack(){
    this.location.back();
  }

}


