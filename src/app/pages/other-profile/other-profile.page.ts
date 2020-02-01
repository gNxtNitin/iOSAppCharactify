import { Component, OnInit, ViewChild } from '@angular/core';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.page.html',
  styleUrls: ['./other-profile.page.scss'],
})
export class OtherProfilePage implements OnInit {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  profileDetails: any;
  paramData: any = {};
  constructor(
    public alertController: AlertController,
    private location: Location,
    private service: PostProvider,    
    public actionSheetController: ActionSheetController,
    private helperService: HelperProvider,
    private router: Router,
    private route: ActivatedRoute,
    public modalController: ModalController) {
      this.route.queryParams.subscribe(params => {        
        if (params && params.special) {
          this.paramData = JSON.parse(params.special);
        }
      });
  }

  ngOnInit() {
    this.getUserProfileDetails();
  }

  getUserProfileDetails() {
    this.helperService.showLoader();
    let obj = this.helperService.deepClone(ServicesConstant.USER_MGMT.GET_PROFILE_DETAILS)
    obj.END_POINT = obj.END_POINT + this.paramData.id;
    this.service.callServiceFunction(obj).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.profileDetails = JSON.parse(res.data);        
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

  navigateBack(){
    this.location.back();
  }

}
