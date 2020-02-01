import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { DataService } from "./../../helper-services/param-data.service";
import { PopOverComponent } from './../../shared/module/pop-over/pop-over.component';
import { PopoverController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-others-rating',
  templateUrl: './others-rating.page.html',
  styleUrls: ['./others-rating.page.scss'],
})
export class OthersRatingPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;

  public paramData: any = {};

  traitObj: any = [];
  categoryshake:any = '';
  subCategoryshake:any = ''; 
  categoryList: any = [];
  subCategoryList: any = [];
  categoriesListModel: any = {
    category: '',
    subCategory: ''
  }
  resultData:any;
  remaningDaysToUpdate:any = ''; 

disableCategory:any = false;

  totalRating = 0;
  averageRating:any = 0;
  enableSave: boolean = false;
  userData: any = {};
  constructor(
    private location: Location,
    private navCtrl: NavController,
    private service: PostProvider,
    public alertController: AlertController,
    private helperService: HelperProvider,
    private rxjsParam: DataService,
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.rxjsParam.currentMessage.subscribe(message => {
      this.paramData = message;
    })
    this.traitObj = this.rxjsParam.getTraitList();
    this.categoryList = this.rxjsParam.getCategoryList();
    this.getUserRatings();
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  getUserRatings() {
    // this.helperService.showLoader();
    let obj = this.helperService.deepClone(ServicesConstant.USER_MGMT.GET_CONNECTION_RATING)
    obj.END_POINT = obj.END_POINT + this.paramData.CRID;    
    this.service.callServiceFunction(obj).subscribe((res: any) => {
     // this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.customizeResponseData(res.data);
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
     // this.helperService.dismissLoader();
    });
  }

  customizeResponseData(res) {
    this.resultData = JSON.parse(res);
    if(this.resultData.Traits.length > 0){
      this.remaningDaysToUpdate = this.resultData.Traits[0].remainingdays;
    }
    console.log(this.resultData)
    this.totalRating  = 0.0;
    if (this.resultData.Category.length) {
      this.traitObj.forEach(element => {
        this.resultData.Traits.forEach(server => {
          if (element.Traitid == server.TraitsID) {
            element.Score = server.Score
          }
        });
        if (element.Score) {
          this.totalRating += element.Score;          
          this.averageRating = this.totalRating / 10;
          if(this.averageRating % 1 == 0){
            this.averageRating = this.averageRating + '.0';
          }
        }
      })
      this.categoriesListModel.category = this.resultData.Category[0].Category;
      if(this.categoriesListModel.category === '1') {
        this.subCategoryList = this.rxjsParam.getFamilyList();
      } else {
        this.subCategoryList = this.rxjsParam.getAcquaintancesList();
      }
      this.categoriesListModel.subCategory = this.resultData.Category[0].Subcategory.toString(); 
      this.disableCategory = true;
    }
  }

  updateRatings() {
    this.totalRating = 0.0;
    let isValid = true;
    this.traitObj.forEach(element => {
      if (element.Score) {
        this.totalRating += element.Score;
      }
      if (!element.Score) {
        isValid = false;
      }
    });
    this.averageRating = Number(this.totalRating / 10);
    if(this.averageRating % 1 == 0){
      this.averageRating = this.averageRating + '.0';
    }
    if (isValid) {
      this.enableSave = true;
      if(this.categoriesListModel.category ==''){
        this.categoryshake = 'categoryshakeCss';
        return;
      } else {
        this.categoryshake = '';
      }
      if(this.categoriesListModel.subCategory ==''){
        this.subCategoryshake = 'subCategoryshakeCss';
        return;
      } else {
        this.subCategoryshake = '';
      }
            
    }

     

    
  }

  async confirmationBox() {
    if(this.categoriesListModel.subCategory =='' || this.categoriesListModel.category ==''){
      this.erroHandler.showErrorToast('Please select Category and Sub-Category to define your relation.', 'error');
      return;
    }
    const alert = await this.alertController.create({
      header: `Confirmation!`,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      message: 'Charactify rating will now lock for next 90 days!',
      buttons: [ {
        text: 'No',
        handler: () => {}
      }, {
          text: 'Yes',
          handler: () => {
            this.submitToAPi();
          }
        }
      ]
    });

    await alert.present();
  }

  submitToAPi(){
    let data = this.createPayload();
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_SELF_SCORE, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.erroHandler.showErrorToast('Successfully rated the user.');   
        this.navCtrl.navigateRoot('/tabs/feed');     
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }

  createPayload() {
    let traitList: any = []
    this.traitObj.forEach(element => {
      traitList.push({
        Traitid: element.Traitid,
        Score: element.Score
      })
    });
    let data = {
      FromUserID: this.userData.UserID,
      ToUserID: this.paramData.ToUserID,
      Category: this.categoriesListModel.category,
      SubCategory: this.categoriesListModel.subCategory,
      ScoreTrait: traitList
    }
    return data;
  }

  resetRatings() {
    this.traitObj.forEach(element => {
      element.Score = 0;
    })
    this.averageRating = 0.0;
    this.enableSave = false;
    this.categoriesListModel.category = '';
    this.categoriesListModel.subCategory = '';
  }

  categoryChangeEvent() {
    if (this.categoriesListModel.category === '1') {
      this.subCategoryList = this.rxjsParam.getFamilyList();
    } else {
      this.subCategoryList = this.rxjsParam.getAcquaintancesList();
    }
    this.categoriesListModel.subCategory = '';
    this.updateRatings();
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

  navigateBack(){
    this.location.back();
  }
}
