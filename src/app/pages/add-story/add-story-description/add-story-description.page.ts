import { Component, OnInit, ViewChild } from '@angular/core';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
import { HelperProvider } from './../../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { AlertController, NavController } from '@ionic/angular';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from "./../../../helper-services/param-data.service";
let win: any = window;
@Component({
  selector: 'add-story-description',
  templateUrl: './add-story-description.page.html',
  styleUrls: ['./add-story-description.page.scss'],
})
export class AddStoryDescriptionPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  private win: any = window;
  videoPlayUrl: any = '';
  selectedItem: any = {};
  feedType: any = '';
  videoSafeUrl: any = '';
  tempVideoThumb: any = '';
  user: any = {};
  postDescription: any = '';
  constructor(
    private service: PostProvider,
    private imageResizer: ImageResizer,
    private helperService: HelperProvider,
    public alertController: AlertController,
    private navCtrl: NavController,
    private base64: Base64,
    private sanitizer: DomSanitizer,
    private paramData: DataService
  ) {
    this.selectedItem = (JSON.parse(localStorage.getItem('selectedPost'))).selectedImg;
    this.feedType = (JSON.parse(localStorage.getItem('selectedPost'))).type;
    if (this.feedType == 'video') {
      this.videoSafeUrl = this.selectedItem[0].fullPath;
      this.videoPlayUrl = this.win.Ionic.WebView.convertFileSrc(this.videoSafeUrl);
      this.tempVideoThumb = 'http://activesurveillancevideoforum.com/wp-content/uploads/2014/12/video-thumbnail-overlay1.png';
    }
    this.user = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {

  }

  playVideo() {
  }


  submitToApi(data) {
    localStorage.setItem('feed', 'true');
    this.paramData.changeUploadFeedMsg(data);
    this.erroHandler.showErrorToast('Upload post is in progress. Will notify you once done.');
    this.navCtrl.navigateRoot('/tabs/feed');
    return false;
  }

  submitPost() {
    let tempImageList = JSON.parse(localStorage.getItem('selectedPost'));
    if (tempImageList.type == 'camera') {
      this.createDataForCameraImage(tempImageList.selectedImg);
    } else if (tempImageList.type == 'video') {
      this.createDataForVideo(tempImageList.selectedImg);
    } else {
      tempImageList.selectedImg.forEach((item) => {
        if (this.checkIfStringIsBase64(item.imagePath)) {
          item.ext = item.imagePath.split(';')[0].split('/')[1];
        }
        else {
          item.ext = item.imagePath.split('.')[1];
        }
      })
      let requests = tempImageList.selectedImg.map((element) => {
        return new Promise((resolve) => {
          if (this.checkIfStringIsBase64(element.imagePath)) {
            element.imagePath = element.imagePath;
            resolve(true);
          } else {
            let AbsoPath = element.imagePath.split('_app_file_/')[1];
            this.base64.encodeFile('file:///' + AbsoPath).then((base64File: string) => {
              element.imagePath = base64File;
              resolve(true);
            }, (err) => {
              console.log(err);
            });
          }

        });
      })

      Promise.all(requests).then(() => {
        let item = [];
        tempImageList.selectedImg.forEach(element => {
          let base64ContentArray = element.imagePath.split(",")
          item.push({
            fileType: 'image',
            Fileformat: '.' + element.ext,
            FilePath: base64ContentArray[1],
            filter: element.filter,
            Description: element.Description
          })
        });

        let data = {
          fromUserID: this.user.UserID,
          toUserID: 0,
          feedType: 'Story',
          fileType: 'image',
          description: this.postDescription,
          feedImagePathslst: item,
          taggingslst: []
        }
        this.submitToApi(data);

      });
    }

  }

  checkIfStringIsBase64(str) {
    return str.includes("data:image/");
  }

  createDataForCameraImage(tempImageList) {
    let item = [];
    tempImageList.forEach(element => {
      let base64ContentArray = element.imagePath.split(",")
      item.push({
        fileType: 'image',
        Fileformat: '.' + element.ext,
        FilePath: base64ContentArray[1],
        filter: element.filter
      })
    });

    let data = {
      fromUserID: this.user.UserID,
      toUserID: 0,
      feedType: 'Story',
      fileType: 'image',
      description: this.postDescription,
      feedImagePathslst: item
    }
    this.submitToApi(data);
  }

  createDataForVideo(tempImageList) {
    let item = [];
    this.base64.encodeFile(this.videoSafeUrl).then((base64File: string) => {
      let base64ContentArray = base64File.split(",")
      item.push({
        fileType: 'video',
        Fileformat: '.' + this.videoSafeUrl.split('.')[1],
        FilePath: base64ContentArray[1],
        filter: ''
      })
      let data = {
        fromUserID: this.user.UserID,
        toUserID: 0,
        feedType: 'Story',
        fileType: 'video',
        description: this.postDescription,
        feedImagePathslst: item
      }
      this.submitToApi(data);
    }, (err) => {
      console.log(err);
    });
  }


}

