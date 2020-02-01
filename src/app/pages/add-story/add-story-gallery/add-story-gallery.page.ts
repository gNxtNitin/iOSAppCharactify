import { Component, OnInit, ViewChild } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { HelperProvider } from './../../../helper-services/helper.services';
let win: any = window;
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { DataService } from "./../../../helper-services/param-data.service";
@Component({
  selector: 'app-add-story-gallery',
  templateUrl: './add-story-gallery.page.html',
  styleUrls: ['./add-story-gallery.page.scss'],
})
export class AddStoryGalleryPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  selectedImage: any = '';
  newPost: any = 'gallery';
  selectedImageListForPost: any = [];
  photosList: any = [];
  isMultiSelect: any = false;
  clonePhonePhotoList: any = {
    list: [],
    itemParPage: 10,
    currentPage: 1
  };
  constructor(
    private photoLibrary: PhotoLibrary,
    private camera: Camera,
    public modalController: ModalController,
    private helperService: HelperProvider,
    private location: Location,
    private router: Router,
    private mediaCapture: MediaCapture,
    private paramData: DataService
  ) {
  }

  ngOnInit() {
    if (this.newPost == 'gallery') {
      this.getPhotosFromDevice();
    }
  }

  getPhotosFromDevice() {
    this.helperService.showLoader();
    this.clonePhonePhotoList.list = [];
    this.clonePhonePhotoList.itemParPage = 10;
    this.clonePhonePhotoList.currentPage = 1;
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: (library: any) => {
          this.helperService.dismissLoader();
          this.clonePhonePhotoList.list = library.library;
          this.loadData('a');
        },
        error: err => {
          this.helperService.dismissLoader();
          console.log('could not get photos');
        },
        complete: () => {
          this.helperService.dismissLoader();
          console.log('done getting photos');
        }
      });
    })
      .catch(err => {
        this.helperService.dismissLoader();
        console.log('permissions weren\'t granted')
      });
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,

    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.selectedImage = base64Image;
      this.isMultiSelect = false;
      this.moveToNext('camera');
    }, (err) => {
    });
  }

  videoCamera() {
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


  loadData(event) {
    for (let i = this.clonePhonePhotoList.itemParPage * this.clonePhonePhotoList.currentPage; i < this.clonePhonePhotoList.itemParPage * this.clonePhonePhotoList.currentPage + this.clonePhonePhotoList.itemParPage; i++) {
      this.clonePhonePhotoList.list[i].id = win.Ionic.WebView.convertFileSrc(this.clonePhonePhotoList.list[i].id.split(';')[1]);
      if (this.clonePhonePhotoList.list[i].id != undefined) {
        this.photosList.push(this.clonePhonePhotoList.list[i]);
        this.clonePhonePhotoList.list[i].id
      } else {
        console.log('id: ' + i)
      }
    }
    this.clonePhonePhotoList.currentPage = this.clonePhonePhotoList.currentPage + 1;
    if (!this.selectedImage) {
      this.selectedImage = this.photosList[0].id;
    }
    if (event == 'a') {
      let selector = document.getElementById('initilizer');
      selector.click()
    }
  }

  segmentChanged(e) {
    this.newPost = e.detail.value;
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  selecteImage(item) {
    if (this.isMultiSelect) {
      if (item.selected) {
        var index = this.selectedImageListForPost.indexOf(item.id);
        if (index > -1) {
          this.selectedImageListForPost.splice(index, 1);
          item.selected = false;
        }
      } else {
        item.selected = true;
        this.selectedImageListForPost.push(item.id);
      }
    } else {

    }
    this.selectedImage = item.id;

  }

  multiSelectSelected() {
    this.isMultiSelect = !this.isMultiSelect;
    if (!this.isMultiSelect) {
      this.selectedImageListForPost = [];
      this.photosList.forEach(element => {
        element.selected = false;
      });
    }
  }

  close() {
    this.router.navigateByUrl('/tabs/feed');
  }

  moveToNext(type) {
    let tempArray: any = [];
    this.isMultiSelect ? '' : tempArray.push(this.selectedImage);
    let data: any = {
      items: this.isMultiSelect ? this.selectedImageListForPost : tempArray,
      feedType: type
    }
    this.paramData.changeMessage(data)
    this.router.navigateByUrl('/add-story-image-filter');
  }

  moveToDescriptionForVideoPost(videoData) {
    localStorage.setItem('selectedPost', JSON.stringify({
      selectedImg: videoData,
      type: 'video'
    }));
    this.router.navigateByUrl('/add-story-description');
  }

}
