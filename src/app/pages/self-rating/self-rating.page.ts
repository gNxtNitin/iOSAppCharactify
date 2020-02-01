import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { DataService } from "./../../helper-services/param-data.service";

@Component({
  selector: 'app-self-rating',
  templateUrl: './self-rating.page.html',
  styleUrls: ['./self-rating.page.scss'],
})
export class SelfRatingPage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;

  traitObj = [];

  totalRating = 0;
  averageRating:any = 0;
  enableSave: boolean = false;
  userData:any={};
  public paramData: any = {};

  constructor(
    private navCtrl: NavController,
    private service: PostProvider,
    private helperService: HelperProvider,
    private rxjsParam: DataService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));    
    this.traitObj = this.rxjsParam.getTraitList();
    this.getSelfRatings();
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  getSelfRatings(){
    this.helperService.showLoader();
    let obj = this.helperService.deepClone(ServicesConstant.USER_MGMT.GET_SELF_RATINGS)
    obj.END_POINT = obj.END_POINT + this.userData.UserID;
    this.service.callServiceFunction(obj).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        console.log(res);
        let resData = JSON.parse(res.data);
        this.averageRating = resData.SelfScore[0][0];
        if(this.averageRating == null){
          this.averageRating = 0;
        }
        if(this.averageRating % 1 == 0){
          this.averageRating = this.averageRating + '.0';
        }
        if(resData.Traits.length > 0){
          resData.Traits.forEach(resElement => {
            this.traitObj.forEach(localItem => {
              if(resElement.TraitsID == localItem.Traitid){
                localItem.Score = resElement.Score;
              }
            });
          });
          this.enableSave = true;
        }
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
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
    }
  }

  saveAndGoToHome() {
    let data = this.createPayload();
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_SELF_SCORE, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
          let currentUserStoredData = JSON.parse(localStorage.getItem('signUp'));
          currentUserStoredData.Isselfrated = 1;
          currentUserStoredData.isNewUser = 1;
          localStorage.setItem('signUp', JSON.stringify(currentUserStoredData));
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
      ToUserID: this.userData.UserID,
      Category: "0",
      SubCategory: "0",
      CRID: "0",
      ScoreTrait: traitList
    }
    return data;
  }

}


