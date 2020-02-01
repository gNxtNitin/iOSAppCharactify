import { Component, OnInit, ViewChild } from '@angular/core';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
import { HelperProvider } from './../../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { AddTagModalPage } from './../add-tag-modal/add-tag-modal.page';
import { DataService } from "./../../../helper-services/param-data.service";
import { Location } from '@angular/common';
let win: any = window;
@Component({
  selector: 'app-add-description',
  templateUrl: './add-description.page.html',
  styleUrls: ['./add-description.page.scss'],
})
export class AddDescriptionPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;  
  private win: any = window;
    videoPlayUrl:any='';
  selectedTags: any = [];
  connectionList: any = [];
  selectedItem: any = {};
  feedType: any = '';
  videoSafeUrl: any = '';
  tempVideoThumb: any = '';
  user: any = {};
  postDescription: any = '';
  taggedList: any = [];
  constructor(
    private location: Location,
    private service: PostProvider,
    private imageResizer: ImageResizer,
    private modalController: ModalController,
    private helperService: HelperProvider,
    public alertController: AlertController,
    private navCtrl: NavController,
    private base64: Base64,
    private sanitizer: DomSanitizer,
    private paramData: DataService
  ) {
    let localStoreData = JSON.parse(localStorage.getItem('selectedPost'));
    if(localStoreData.type != 'text'){
      this.selectedItem = (JSON.parse(localStorage.getItem('selectedPost'))).selectedImg;
    }else{
      this.selectedItem =[];
    }
    
    this.feedType = (JSON.parse(localStorage.getItem('selectedPost'))).type;
    if (this.feedType == 'video') {
      this.videoSafeUrl = this.selectedItem[0].fullPath;
      this.videoPlayUrl = this.win.Ionic.WebView.convertFileSrc(this.videoSafeUrl);
      this.tempVideoThumb = 'http://activesurveillancevideoforum.com/wp-content/uploads/2014/12/video-thumbnail-overlay1.png';
    }
    this.user = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
    this.getMyConnections();
  }

  getMyConnections() {
    this.helperService.showLoader();
    let data = {
      UserID: this.user.UserID,      
      UserName: ""
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_TAG_LIST_SEARCH, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.connectionList = JSON.parse(res.data).ConnectionSearchList;
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
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
    let tagItem: any = [];
    this.taggedList.forEach(element => {
      tagItem.push({
        userid: this.user.UserID,
        Touserid: element.UserId
      });
    });

    if (tempImageList.selectedImg) {
      if (tempImageList.type == 'camera') {
        this.createDataForCameraImage(tempImageList.selectedImg);
      } else if (tempImageList.type == 'video') {
        this.createDataForVideo(tempImageList.selectedImg);
      } else {
        tempImageList.selectedImg.forEach((item) => {
          if (this.checkIfStringIsBase64(item.imagePath)) {
            item.ext = item.imagePath.split(';')[0].split('/')[1];
          } else {
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
              filter: element.filter
            })
          });

          let data = {
            fromUserID: this.user.UserID,
            toUserID: 0,
            feedType: 'Feed',
            fileType: 'image',
            description: this.postDescription,
            feedImagePathslst: item,
            taggingslst: tagItem
          }
          this.submitToApi(data);
        });
      }
    } else {
      if (this.postDescription) {
        let data = {
          FeedID: 0,
          FromUserID: this.user.UserID,
          FeedType: 'Feed',
          FileType: "text",
          ToUserID: 0,
          Description: this.postDescription,
          IsDelete: false,
          feedImagePathslst: [],
          taggingslst: tagItem
        }
        this.submitToApi(data);
      } else {
        alert('No text to create a post.')
      }
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
    let tagItem: any = [];
    this.taggedList.forEach(element => {
      tagItem.push(
        {
          userid: this.user.UserID,
          Touserid: element.UserId
        }
      );
    });

    let data = {
      fromUserID: this.user.UserID,
      toUserID: 0,
      feedType: 'Feed',
      fileType: 'image',
      description: this.postDescription,
      feedImagePathslst: item,
      taggingslst: tagItem
    }
    this.submitToApi(data);
  }

  createDataForVideo(tempImageList) {
    let taggedItem: any = [];
    let item = [];
    this.base64.encodeFile(this.videoSafeUrl).then((base64File: string) => {
      console.log('base64File..' + base64File);
      let base64ContentArray = base64File.split(",")
      item.push({
        fileType: 'video',
        Fileformat: '.' + this.videoSafeUrl.split('.')[1],
        FilePath: base64ContentArray[1],
        filter: ''
      })
      let tagItem: any = [];
      this.taggedList.forEach(element => {
        tagItem.push(
          {
            userid: this.user.UserID,
            Touserid: element.UserId
          }
        );
      });
      let data = {
        fromUserID: this.user.UserID,
        toUserID: 0,
        feedType: 'Feed',
        fileType: 'video',
        description: this.postDescription,
        feedImagePathslst: item,
        taggingslst: tagItem
      }
      this.submitToApi(data);
    }, (err) => {
      console.log(err);
    });
  }


  async addTag() {
    const modal = await this.modalController.create({
      component: AddTagModalPage,
      cssClass: '',
      componentProps: {
        'selectedItems': this.connectionList
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        if (data.data) {
          this.taggedList = data.data.description;
        }
      });
    return await modal.present();
  }

  removeTaggedItem(item) {
    this.taggedList = this.taggedList.filter(elem => elem.UserId !== item.UserId);
  }

  navigateBack(){
    this.location.back();
  }

}

