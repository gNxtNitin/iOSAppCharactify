import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import {HelperProvider} from './../../helper-services/helper.services';
import {ErrorHandlerComponent} from './../../shared/module/error-handler/error-handler.component';
import { DataService } from "./../../helper-services/param-data.service";

@Component({
  selector: 'app-lets-begin',
  templateUrl: './lets-begin.page.html',
  styleUrls: ['./lets-begin.page.scss'],
})
export class LetsBeginPage implements OnInit {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  constructor(
    private camera: Camera, 
    private navCtrl: NavController, 
    public actionSheetController: ActionSheetController,
    private service: PostProvider,   
    private helperService: HelperProvider
    ) { }

  userData:any={};
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  navigateToSelfRating() {
    this.navCtrl.navigateRoot('/self-rating');
  }

  async askImageSource() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose image source',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.getImageFromCamera();
        }
      }, {
        text: 'Gallery',
        icon: 'albums',
        handler: () => {          
          this.getImageFromGallery()
        }      
      }]
    });
    await actionSheet.present();
  }

  getImageFromGallery(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
       mediaType: this.camera.MediaType.PICTURE,
       sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
       allowEdit:true
    }
    
    this.camera.getPicture(options).then((imageData) => {
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.userData.UserProfilePic = base64Image;
     this.uploadImage(base64Image);
    }, (err) => {     
    });
  }

  getImageFromCamera(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true
    }
    
    this.camera.getPicture(options).then((imageData) => {      
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.userData.UserProfilePic = base64Image;
     this.uploadImage(base64Image);
    }, (err) => {     
    });
  }

  uploadImage(image){
    let data:any = {
      UserId: this.userData.UserID,
      UserProfilePic: image
    }
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.UPLOAD_PROFILE_PICTURE, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res) {
        if(res.code != 1001){          
          this.erroHandler.showErrorToast(res.message, 'error');          
        } else{
          let currentUserStoredData = JSON.parse(localStorage.getItem('signUp'));
          currentUserStoredData.UserProfilePic = res.data;
          localStorage.setItem('signUp', JSON.stringify(currentUserStoredData));
          this.erroHandler.showErrorToast('Profile picture updated successfully');
        }                
      }
    }, error => {      
      this.helperService.dismissLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');      
    });
  }

}
