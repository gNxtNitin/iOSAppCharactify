import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PopoverController, NavController, ActionSheetController } from '@ionic/angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { HomeWalkThroughComponent } from './walk-through/home-walk-through.component';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { DataService } from "./../../helper-services/param-data.service";
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  routerSubscription: any;
  userStaus: any = true;
  showNotificationBadge: any = false;
  selectedImages: any = [];

  constructor(
    private router: Router,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    public popoverCtrl: PopoverController,
    private photoLibrary: PhotoLibrary,
    private service: PostProvider,
    public actionSheetController: ActionSheetController,
    private helperService: HelperProvider,
    private rxjsParam: DataService,
    private device: Device
  ) {

    this.rxjsParam.notificationChangeMsg.subscribe(message => {
      if (message != 'notification-change') {
        if ((localStorage.getItem('push-notification') == 'true')) {
          this.updateNotificationIcon(message);
          localStorage.setItem('push-notification', 'false');
        }
      }
    });
  }

  ionViewWillEnter() {

  }
  updateNotificationIcon(msg) {
    if (msg) {
      if (this.router.url == '/tabs/notifications') {
        this.showNotificationBadge = false;
      } else {
        this.showNotificationBadge = true;
      }
    } else {
      this.showNotificationBadge = false;
    }
    let selector = document.getElementById('initilizer');
    selector.click()
  }

  ngOnInit() {    
    this.showSearchTabPopUp();
    //this.routerWatch();
  }

  hideNotificationBuble() {
    this.updateNotificationIcon(false);
  }

  showSearchTabPopUp() {
    if (!(localStorage.getItem('searchpopup'))) {
      let selector = document.getElementById('search');
      selector.click();
      localStorage.setItem('searchpopup', 'true')
    }
  }

  checkUserStatus() {
    let currentUserStoredData = JSON.parse(localStorage.getItem('signUp'))
    if (currentUserStoredData.isNewUser == 1) {
      setTimeout(() => {
        let selector = document.getElementById('search');
        selector.click();
        currentUserStoredData.isNewUser = 0;
        localStorage.setItem('signUp', JSON.stringify(currentUserStoredData));
      }, 10)

    }
    let stat = JSON.parse(localStorage.getItem('walkThroughStatus'));
    if (false) {
      let userData = JSON.parse(localStorage.getItem('signUp'));
      let obj = this.helperService.deepClone(ServicesConstant.USER_MGMT.GET_USER_SELF_STATUS);
      obj.END_POINT = obj.END_POINT + userData.UserID;
      this.service.callServiceFunction(obj).subscribe((res: any) => {
        if (res.code == 1001) {
          if (res.data == 1) {
            this.userStaus = false;
            let currentUserStoredData = JSON.parse(localStorage.getItem('signUp'));
            currentUserStoredData.Isselfrated = 1;
            localStorage.setItem('signUp', JSON.stringify(currentUserStoredData));
          } else {
            let selector = document.getElementById('search');
            selector.click()
          }
        }
      }, error => {
      });
    }

  }

  routerWatch() {
    this.routerSubscription = this.router.events.subscribe(
      (event: NavigationEnd) => {
        if (event instanceof NavigationEnd) {
          if (event.url == '/tabs/feed') {
            let selector = document.getElementById('search');
              selector.click();
            // let selector = document.getElementById('search');
            // selector.click()
          }
          if (event.url == '/tabs/home') {
            let selector = document.getElementById('search');
              selector.click();
            // let selector = document.getElementById('charactify');
            //selector.click()
          }
          if (event.url == '/tabs/notifications') {
            let selector = document.getElementById('search');
              selector.click();
            // let selector = document.getElementById('notifications');
            //selector.click()
          }
        }
      }
    );
  }

  tabNavigation(route) {
    this.router.navigateByUrl('/tabs/' + route);
  }

  showPopOver(ev: any, page) {
    if (this.userStaus) {
      if (page == 'notification') {
        if (!localStorage.getItem('notification')) {
          this.showPopOverOverlay(ev);
          localStorage.setItem('notification', 'DONE')
        }
      }
      if (page == 'home') {
        if (!localStorage.getItem('home')) {
          this.showPopOverOverlay(ev);
          localStorage.setItem('home', 'DONE')
        }
      }
      if (page == 'search') {
        if (!localStorage.getItem('search')) {
          this.showPopOverOverlay(ev);
        }
      }
      if (page == 'charactify') {
        if (!localStorage.getItem('charactify')) {
          this.showPopOverOverlay(ev);
          localStorage.setItem('charactify', 'DONE')
        }
      }

    }
  }

  async showPopOverOverlay(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: HomeWalkThroughComponent,
      mode: 'ios',
      animated: true,
      event: ev,
      cssClass: 'walkThrough'
    });
    return await popover.present();
  }

  // imagePicker code starts here
  async goToNewGallery() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose media source for feed post creation',
      buttons: [{
        text: 'Image Gallery',
        icon: 'images',
        handler: () => {
          this.getPhotosFromDevice();
        }
      },{
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
      }, {
        text: 'Text Only',
        icon: 'color-filter',
        handler: () => {
          localStorage.setItem('selectedPost', JSON.stringify({
            type: 'text'
          }));
          this.router.navigateByUrl('/add-description');
        }
      }]
    });
    await actionSheet.present();
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
      if (results == 'OK') {
        this.getPhotosFromDevice();
      } else {
        if (results.length > 0) {
          results.forEach(element => {
            this.selectedImages.push('data:image/jpeg;base64,' + element)
          });
          this.moveToNext();
        }
      }
    }, (err) => { });
  }

  openCamera() {
    this.selectedImages = [];
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.selectedImages.push(base64Image);
      this.moveToNext();
    }, (err) => {
      // Handle error
    });
  }

  openVideoGallery(){
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
        fullPath: 'file://'+imageData
      } )
      this.moveToDescriptionForVideoPost(item);
    }, (err) => {
      // Handle error
    });
  }

  videoCamera() {
    if (this.device.platform.toLowerCase() === 'ios') {
      const options: CaptureVideoOptions = { duration: 10, quality: 0 };
      this.mediaCapture.captureVideo(options)
        .then(
          (data: MediaFile[]) => {
            console.log(data);
            this.moveToDescriptionForVideoPost(data);
          },
          (err: CaptureError) => {
            console.error(err);
          }
        );
    } else {
      this.photoLibrary.requestAuthorization().then((results: any) => {
        console.log(JSON.stringify(results));
        if (results == 'OK') {
          const options: CaptureVideoOptions = { duration: 10, quality: 0 };
          this.mediaCapture.captureVideo(options)
            .then(
              (data: MediaFile[]) => {
                console.log(data);
                this.moveToDescriptionForVideoPost(data);
              },
              (err: CaptureError) => {
                console.error(err);
              }
            );
        }
      })
        .catch(err => console.log('permissions weren\'t granted'));
    }
  }

  moveToNext() {
    let data: any = {
      items: this.selectedImages,
      feedType: 'image'
    };
    this.rxjsParam.changeMessage(data)
    this.router.navigateByUrl('/image-filter');
  }

  moveToDescriptionForVideoPost(videoData) {
    localStorage.setItem('selectedPost', JSON.stringify({
      selectedImg: videoData,
      type: 'video'
    }));
    this.router.navigateByUrl('/add-description');
  }

}
