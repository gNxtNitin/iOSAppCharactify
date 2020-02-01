import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, PopoverController, ModalController, IonInfiniteScroll, IonVirtualScroll, ActionSheetController } from '@ionic/angular';
import * as Zuck from './../../../../libs/zuck/zuck';
import { PopOverComponent } from './../../../shared/module/pop-over/pop-over.component';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
import { HelperProvider } from './../../../helper-services/helper.services';
import { ReactionsComponent } from './reactions/reactions.component';
import { PostImageViewerPage } from './post-image-viewer/post-image-viewer.page';
import { ViewReactionsListPage } from './view-reactions-list/view-reactions-list.page';
import { ViewCommentsListPage } from './view-comment-list/view-comment-list.page';
import { UpdateFeedModalPage } from './update-feed-modal/update-feed-modal.page';
import { ShareModalPage } from './share-modal/share-modal.page';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from "./../../../helper-services/param-data.service";
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { take, takeLast } from 'rxjs/operators';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { FeedWalkThroughComponent } from './walk-through/home-walk-through.component';
import { AddTagModalPage } from './add-tag-modal/add-tag-modal.page';

declare var $: any;

@Component({
  selector: 'app-tab-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['feed.page.scss']
})
export class FeedPage {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  stories: any;
  infiniteScrollActive: any;
  userData: any = {};
  feedList: any = [];
  storiesList: any = [];
  enableScrollEvent: Boolean = true;
  feedPaginitation: any = {
    pageNo: 1,
    pageSize: 4,
    Story: 1
  }
  errorOccured: any = true;
  errorMsg: any = '';
  routerSubscription: any;
  selectedImages: any = [];

  constructor(
    private camera: Camera,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    public alertController: AlertController,
    private photoLibrary: PhotoLibrary,
    public elementRef: ElementRef,
    public actionSheetController: ActionSheetController,
    private service: PostProvider,
    public modalController: ModalController,
    private helperService: HelperProvider,
    public popoverController: PopoverController,
    public popoverCtrl: PopoverController,
    private rxjsParam: DataService,
    private router: Router) {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  checkMedia(e) {

  }

  ngAfterViewInit() {
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
    this.rxjsParam.postUploadMsg.subscribe(message => {
      if (message != 'share-post') {
        if ((localStorage.getItem('feed') == 'true')) {
          this.sharePostEvent(message);
          localStorage.setItem('feed', 'false');
        }
      }
    })

    // setTimeout(() => {
    //   let selector = document.getElementById('feed-pop');
    //   selector.click();
    // }, 1000);
    this.routerWatch();
  }

  routerWatch() {
    this.routerSubscription = this.router.events.subscribe(
      (event: NavigationEnd) => {
        if (event instanceof NavigationEnd) {
          if (event.url == '/tabs/feed') {
           // this.feedPaginitation.pageNo = 1;
            //this.loadStoryData();
            //this.feedList = [];
            //this.storiesList = [];
            //this.loadFeedData('');
            //this.userData = JSON.parse(localStorage.getItem('signUp'));
            let selector = document.getElementById('feed-pop');
              selector.click();
          }

        }
      }
    );
  }

  ionPageWillLeave() {
    this.routerSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.feedPaginitation.pageNo = 1;
    this.loadStoryData();
    this.feedList = [];
    this.storiesList = [];
    this.loadFeedData('');

  }

  loadStoryData() {
    let data = {
      UserId: this.userData.UserID,
      pageNo: 0,
      pageSize: 0,
      Story: 0
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_STORY, data).subscribe((res: any) => {
      if (res.code == 1001) {
        this.customizeStoryResponseData(JSON.parse(res.data));
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  customizeStoryResponseData(storyList) {

    storyList.forEach(element => {
      let itemsList: any = [];
      element.items.forEach(itm => {
        let storyTimeStamp = new Date(itm.Date).getTime() / 1000;
        itemsList.push(
          this.buildItem(
            itm.id,
            itm.FileType == 'image' ? 'photo' : itm.FileType,
            itm.FileType == 'video' ? 30 : 9,
            itm.Path,
            '',
            itm.Description,//link
            itm.Description,// link text
            false,
            storyTimeStamp)
        )
      });

      this.storiesList.push({
        id: element.Userid,
        photo: element.UserProfilePic,
        name: element.FristName ? element.FristName : '.',
        link: element.UserProfilePic,
        items: itemsList
      });
    });
    setTimeout(() => {
      this.stories = new Zuck('stories', {
        backNative: true,
        backButton: true,
        previousTap: true,
        autoFullScreen: true,
        openEffect: false,
        skin: 'snapgram',
        avatars: true,
        list: false,
        cubeEffect: true,
        localStorage: true,
        arrowControl: true,
        stories: this.storiesList
      })
    }, 500)

  }

  buildItem(id, type, length, src, preview, link, linkText, seen, time) {
    return {
      id, type, length, src, preview, link, linkText, seen, time,
    };

  }


  loadFeedData(evnt: any, isRefresher?) {
    this.storiesList = [];
    this.loadStoryData();

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
    if (this.enableScrollEvent) {
      this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_FEEDS, this.feedPaginitation).subscribe((res: any) => {
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
    } else {

    }
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
    setTimeout(() => {
      obj.commentDec = '';
    }, 0)
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
          text: 'Add/Update Tag',
          handler: () => {
            this.addUpdateTag(selectedFeed);
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




  async addUpdateTag(item) {
    const modal = await this.modalController.create({
      component: AddTagModalPage,
      cssClass: '',
      componentProps: {
        'selectedTags': item
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        if (data.data) {
          this.loadFeedData('', 'isRefresher')
         // this.taggedList = data.data.description;
        }
      });
    return await modal.present();
  }

  removeTaggedItem(item) {
    //this.taggedList = this.taggedList.filter(elem => elem.UserId !== item.UserId);
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
        let selector = document.getElementById('initilizer');
        selector.click()
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


  sharePostEvent(data) {
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_FEED, data).subscribe((res: any) => {
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('New post created successfully.');
        localStorage.removeItem("selectedPost");
        this.feedPaginitation.pageNo = 1;
        this.loadStoryData();
        this.feedList = [];
        this.storiesList = [];
        this.loadFeedData('');
      }
    }, error => {
    });
  }


  //imagePicker code starts here

  async goToNewGallery() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Choose media source for story creation',
      buttons: [{
        text: 'Gallery',
        icon: 'images',
        handler: () => {
          this.getPhotosFromDevice();
        }
      }, {
        text: 'Video Gallery',
        icon: 'play-circle',
        handler: () => {
          this.openVideoGallery();
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.openCamera();
        }
      }, {
        text: 'Video',
        icon: 'videocam',
        handler: () => {
          this.videoCamera();
        }
      }]
    });
    await actionSheet.present();
  }

  openVideoGallery() {
    this.selectedImages = [];
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.VIDEO,
    }

    this.camera.getPicture(options).then((imageData) => {
      let item = [];
      item.push({
        fullPath: 'file://' + imageData
      })
      this.moveToDescriptionForVideoPost(item);
    }, (err) => {
      // Handle error
    });
  }

  getPhotosFromDevice() {
    this.selectedImages = [];
    let options: ImagePickerOptions = {
      quality: 70,
      width: 600,
      height: 600,
      outputType: 1,
      maximumImagesCount: 10
    };

    this.imagePicker.getPictures(options).then((results) => {
      results.forEach(element => {
        this.selectedImages.push('data:image/jpeg;base64,' + element)
      });
      this.moveToNext();
    }, (err) => { });
  }


  openCamera() {
    this.selectedImages = [];
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,

    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.selectedImages.push(base64Image);
      this.moveToNext();
    }, (err) => {
      // Handle error
    });
  }



  videoCamera() {
    this.photoLibrary.requestAuthorization().then((results: any) => {
      if (results == 'OK') {
        let options: CaptureVideoOptions = { limit: 1, duration: 10, quality: 0 }
        this.mediaCapture.captureVideo(options)
          .then(
            (data: MediaFile[]) => {
              console.log(data)
              this.moveToDescriptionForVideoPost(data);

            },
            (err: CaptureError) => {
              console.error(err)
            }
          );
      }
    })
  }



  moveToNext() {
    let data: any = {
      items: this.selectedImages,
      feedType: 'image'
    }
    this.rxjsParam.changeMessage(data)
    this.router.navigateByUrl('/add-story-image-filter');
  }

  moveToDescriptionForVideoPost(videoData) {
    localStorage.setItem('selectedPost', JSON.stringify({
      selectedImg: videoData,
      type: 'video'
    }));
    this.router.navigateByUrl('/add-story-description');
  }


  async feedShowPopOverOverlay(ev: any, screenName) {
    const popover = await this.popoverCtrl.create({
      component: FeedWalkThroughComponent,
      mode: 'ios',
      animated: true,
      event: ev,
      cssClass: 'walkThrough'
    });
    return await popover.present();
  }


}


