import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from "./../../../helper-services/param-data.service";
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
import { HelperProvider } from './../../../helper-services/helper.services';
import { NavController, ModalController } from '@ionic/angular';
import { CropperComponent } from 'angular-cropperjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-filter',
  templateUrl: './image-filter.page.html',
  styleUrls: ['./image-filter.page.scss'],
})
export class ImageFilterPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  @ViewChild('angularCropper') public angularCropper: CropperComponent;

  feedType:any='';
  selectedClass: any = '1977';
  selectedImagesList: any = [];
  selectedFilterImage: any = '';
  selectedFilterTab: any = 'imageFilter';

  cropperOptions: any;
  croppedImage = null;

  myImage = null;
  scaleValX = 1;
  scaleValY = 1;
  selectedImg: any = {};

  showFiltersTab = true;
  selectedObject: any;

  filterList: any = [
    { class: '1977', selected: false },
    { class: 'aden', selected: false },
    { class: 'amaro', selected: false },
    { class: 'brannan', selected: false },
    { class: 'brooklyn', selected: false },
    { class: 'clarendon', selected: false },
    { class: 'gingham', selected: false },
    { class: 'hudson', selected: false },
    { class: 'inkwell', selected: false },
    { class: 'kelvin', selected: false },
    { class: 'lark', selected: false },
    { class: 'lofi', selected: false },
    { class: 'mayfair', selected: false },
    { class: 'moon', selected: false },
    { class: 'nashville', selected: false },
    { class: 'perpetua', selected: false },
    { class: 'reyes', selected: false },
    { class: 'rise', selected: false },
    { class: 'slumber', selected: false },
    { class: 'stinson', selected: false },
    { class: 'toaster', selected: false },
    { class: 'valencia', selected: false },
    { class: 'walden', selected: false },
    { class: 'willow', selected: false },
    { class: 'xpro2', selected: false }
  ]

  constructor(
    private service: PostProvider,
    private helperService: HelperProvider,
    private rxjsParam: DataService,
    private navCtrl: NavController,
    private router: Router,
    public modalController: ModalController,
    private location: Location
  ) {
    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 1,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
    };
  }

  ngOnInit() {
    this.rxjsParam.currentMessage.subscribe((message: any) => {
      this.feedType = message.feedType;
      this.customizeData(message.items);
    });
  }

  customizeData(list) {
    list.forEach((element, index) => {
      this.selectedImagesList.push({
        imagePath: element,
        filter: '',
        selected: false,
        id: index
      })
    });
    if (this.selectedImagesList.length > 1) {
      this.showFiltersTab = false;
    } else {
      this.selectedObject = this.selectedImagesList[0];
    }

    this.selectedFilterImage = this.selectedImagesList[0].imagePath;
    this.selectedImagesList[0].filter = '1977';
    this.selectedImagesList[0].selected = true;
    this.myImage = this.selectedImagesList[0].imagePath;
  }

  changeClass(item) {
    this.selectedImagesList.forEach(element => {
      element.filter = item.class;
    });
  }

  changeClass1(item) {
    this.selectedObject.filter = item.class;
  }

  applyFilterTOSelectedImage(item) {
    this.selectedObject = item;
    this.showFiltersTab = true;
  }

  close() {
    this.selectedFilterTab = 'imageFilter';
    if (this.showFiltersTab && this.selectedImagesList.length == 1) {

      this.router.navigateByUrl('/tabs/feed');
    } else {
      this.showFiltersTab = false;
    }
  }

  updateFilteredImage() {
    this.selectedImagesList.forEach(element => {
      if (element.id == this.selectedObject.id) {
        element = this.selectedObject;
      }
    });
    this.selectedFilterTab = 'imageFilter';
    if (this.showFiltersTab && this.selectedImagesList.length == 1) {      
      localStorage.setItem('selectedPost', JSON.stringify({
        selectedImg: this.selectedImagesList,
        type: this.feedType 
      }));
      this.router.navigateByUrl('/add-description');
    } else {
      this.showFiltersTab = false;
    }
  }

  moveToNext() {    
    localStorage.setItem('selectedPost', JSON.stringify({
      selectedImg: this.selectedImagesList,
      type: this.feedType 
    }));
      this.router.navigateByUrl('/add-description');
  }

  segmentChanged(e) {
    this.selectedFilterTab = e.detail.value;
  }

  showFilters() {

  }

  showEdit() {

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

  updateCropedImage() {
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.selectedObject.imagePath = croppedImgB64String;

    this.selectedImagesList.forEach(element => {
      if (element.id == this.selectedObject.id) {
        element = this.selectedObject;
      }
    });
    if (this.showFiltersTab && this.selectedImagesList.length == 1) {      
      localStorage.setItem('selectedPost', JSON.stringify({
        selectedImg: this.selectedImagesList,
        type: this.feedType 
      }));
      this.router.navigateByUrl('/add-description');
    } else {
      this.selectedFilterTab = 'imageFilter';
      this.showFiltersTab = false;
    }
  }

}
