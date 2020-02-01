import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { EducationUpdateModalComponent } from './education-update-modal/education-update-modal.component';
import { ProfileImageCropComponent } from './profile-image-crop/profile-image-crop.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  userData: any = {};
  profileDetails: any = {User:[{
    UserProfilePic: '',
    firstname: '',
    LastName: '',
    Card: '',
    Phone: '',
    DateOfBirth: '',
    Gender: '',
    City: '',
    AppUserName: '',
  }]};    
  userCardData: any = {};
  constructor(
    private location: Location,
    private sanitizer: DomSanitizer,
    public alertController: AlertController,
    private service: PostProvider,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    private helperService: HelperProvider,
    public modalController: ModalController) {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
    this.getUserProfileDetails();
  }

  getUserProfileDetails() {
    this.helperService.showLoader();
    let obj = this.helperService.deepClone(ServicesConstant.USER_MGMT.GET_PROFILE_DETAILS)
    obj.END_POINT = obj.END_POINT + this.userData.UserID;
    this.service.callServiceFunction(obj).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.profileDetails = JSON.parse(res.data);
        let currentUserStoredData = JSON.parse(localStorage.getItem('signUp'));
        currentUserStoredData.FirstName = this.profileDetails.User[0].firstname;
        currentUserStoredData.LastName = this.profileDetails.User[0].LastName;
        localStorage.setItem('signUp', JSON.stringify(currentUserStoredData));

        if (this.profileDetails.User[0].Card == 'True') {
          this.getUserRatingCard();
        }
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

  async openUpdateModal(item, component) {
    const modal = await this.modalController.create({
      component: EducationUpdateModalComponent,
      componentProps: {
        'selectedItem': item,
        'selectedComponent': component
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.submitUpdateProfile(item, component, data);
      });

    return await modal.present();
  }

  submitUpdateProfile(selectedItem, component, newData) {
    if (!newData.data) {
      return;
    }
    if (component == 'EDUCATION') {
      if (!selectedItem) {
        newData.data.UserSchoolID = 0;
        newData.data.userId = this.userData.UserID;
      }
      var fromdate = new Date(newData.data.Fromdate);
      var todate = new Date(newData.data.Todate);
      newData.data.Fromdate = (fromdate.getMonth() + 1) + '/' + fromdate.getDate() + '/' + fromdate.getFullYear();
      newData.data.Todate = (todate.getMonth() + 1) + '/' + todate.getDate() + '/' + todate.getFullYear();

      newData.data.Isgraduated = newData.data.Isgraduated ? 1 : 0;
      newData.data.Ispublic = newData.data.Ispublic ? 1 : 0;
      this.submitEducationDetailsToApi(newData.data);
    }
    if (component == 'WORK') {
      if (!selectedItem) {
        newData.data.UserEducationID = 0;
        newData.data.userId = this.userData.UserID;
      }
      var fromdate = new Date(newData.data.Fromdate);
      newData.data.Fromdate = (fromdate.getMonth() + 1) + '/' + fromdate.getDate() + '/' + fromdate.getFullYear();
      if (!newData.data.Todate) {
        newData.data.Todate = '';
      } else {
        var todate = new Date(newData.data.Todate);
        newData.data.Todate = (todate.getMonth() + 1) + '/' + todate.getDate() + '/' + todate.getFullYear();
      }

      newData.data.Ispublic = newData.data.Ispublic ? 1 : 0;
      newData.data.Isstillworking = newData.data.Isstillworking ? 1 : 0;
      this.submitWorkDetailsToApi(newData.data)
    }
    if (component == 'PROFILE') {
      this.getUserProfileDetails();
    }
  }

  submitProfileDetailsToApi(data) {
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.UPDATE_PROFILE, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('Profile updated successfully');
        this.getUserProfileDetails();
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

  submitEducationDetailsToApi(data) {
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_UPDATE_EDUCATION_DETAILS, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('Profile updated successfully');
        this.getUserProfileDetails();
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

  submitWorkDetailsToApi(data) {
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_UPDATE_WORK_DETAILS, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('Profile updated successfully');
        this.getUserProfileDetails();
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

  async removeEducationItem(item) {

    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'Are you sure want to remove this profile detail?',
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
            let data = {
              UserSchoolID: item.UserSchoolID
            }
            this.helperService.showLoader();
            this.service.callServiceFunction(ServicesConstant.USER_MGMT.DELETE_EDUCATION_DETAIL, data).subscribe((res: any) => {
              this.helperService.dismissLoader();
              if (res.code == 1001) {
                this.erroHandler.showErrorToast('Details removed successfully.');
                this.getUserProfileDetails();
              } else {
                this.erroHandler.showError(res.message);
              }
            }, error => {
              this.erroHandler.showError(error.error.data);
              this.helperService.dismissLoader();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async removeWorkItem(item) {
    const alert = await this.alertController.create({
      header: `Confirm!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'Are you sure want to remove this profile detail?',
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
            let data = {
              UserEducationID: item.WorkDetailsId
            }
            this.helperService.showLoader();
            this.service.callServiceFunction(ServicesConstant.USER_MGMT.DELETE_WORK_DETAIL, data).subscribe((res: any) => {
              this.helperService.dismissLoader();
              if (res.code == 1001) {
                this.erroHandler.showErrorToast('Details removed successfully.');
                this.getUserProfileDetails();
              } else {
                this.erroHandler.showError(res.message);
              }
            }, error => {
              this.erroHandler.showError(error.error.data);
              this.helperService.dismissLoader();
            });
          }
        }
      ]
    });
    await alert.present();
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

  getImageFromGallery() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.openEditProfileModal(base64Image);
    }, (err) => {
      // Handle error
    });
  }

  getImageFromCamera() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.openEditProfileModal(base64Image);
    }, (err) => {
      // Handle error
    });
  }

  uploadImage(image) {
    let data: any = {
      UserId: this.userData.UserID,
      UserProfilePic: image
    }
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.UPLOAD_PROFILE_PICTURE, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res) {
        if (res.code != 1001) {
          this.erroHandler.showErrorToast(res.message, 'error');
        } else {
          this.userData.UserProfilePic = image;
          let currentUserStoredData = JSON.parse(localStorage.getItem('signUp'));
          currentUserStoredData.UserProfilePic = res.data;
          localStorage.setItem('signUp', JSON.stringify(currentUserStoredData));
          this.erroHandler.showErrorToast('Profile picture updated successfully');
          this.getUserProfileDetails();
        }
      }
    }, error => {
      this.helperService.dismissLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  async openEditProfileModal(img) {
    let selectedImage = img;
    const modal = await this.modalController.create({
      component: ProfileImageCropComponent,
      componentProps: {
        'selectedImage': selectedImage
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data) {
          this.uploadImage(data.data);
        }
      });

    return await modal.present();
  }

  getUserRatingCard() {
    this.helperService.showLoader();
    let obj = this.helperService.deepClone(ServicesConstant.USER_MGMT.GET_USER_RATING_CARD)
    obj.END_POINT = obj.END_POINT + this.userData.UserID;
    this.service.callServiceFunction(obj).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.userCardData = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + res.data);
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

  shareRatingCard() {
    this.socialSharing.share('Message', 'Subject', this.userCardData.changingThisBreaksApplicationSecurity, 'https://ionicframework.com');
  }

  navigateBack() {
    this.location.back();
  }

}
