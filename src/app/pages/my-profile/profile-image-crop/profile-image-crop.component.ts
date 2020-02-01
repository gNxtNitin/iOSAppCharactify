import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { HelperProvider } from './../../../helper-services/helper.services';
import { CropperComponent } from 'angular-cropperjs';
@Component({
  selector: 'app-profile-image-crop',
  templateUrl: './profile-image-crop.component.html',
  styleUrls: ['./profile-image-crop.component.scss'],
})
export class ProfileImageCropComponent implements OnInit {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  @ViewChild('angulacontainerrCropper') public angularCropper: CropperComponent;

  cropperOptions: any;
  croppedImage = null;

  myImage = null;
  scaleValX = 1;
  scaleValY = 1;
  selectedImg: any = {};

  constructor(private helperService: HelperProvider, private modalController: ModalController, private navParams: NavParams) {
    this.selectedImg = this.navParams.get('selectedImage');    
    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 1,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
      responsive:true,
      background : true,
      viewMode: 1,
      minContainerWidth: 500,
      minContainerHeight: 450,
      minCanvasWidth:300,
      minCanvasHeight:300
    };
  }


  ngOnInit() { }

  

  close() {
    this.modalController.dismiss();
  }

  reset() {
    this.angularCropper.cropper.reset();
  }

  clear() {
    this.angularCropper.cropper.clear();
  }

  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  getCropedImage(){
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.modalController.dismiss(croppedImgB64String);
  }

 

}
