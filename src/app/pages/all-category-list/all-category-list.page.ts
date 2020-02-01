import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { PostProvider } from '../../api-provider/api.services';
import { ServicesConstant } from '../../api-provider/end-points';
import { HelperProvider } from '../../helper-services/helper.services';
import { ErrorHandlerComponent } from '../../shared/module/error-handler/error-handler.component';
import { CategoryFilterPopupComponent } from '../../shared/module/category-filter-popup/category-filter-popup.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-all-category-list',
  templateUrl: './all-category-list.page.html',
  styleUrls: ['./all-category-list.page.scss'],
})
export class AllCategoryListPage implements OnInit {
  userData: any;
  categoryList: any;
  categoryListCopy: any;
  filteron = 'All';

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  constructor(
    private location: Location,
    private service: PostProvider,
    private helperService: HelperProvider,
    public popoverCtrl: PopoverController,
    private router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
    this.getUserRatings();
  }

  getUserRatings() {
    this.helperService.showLoader();
    let obj = {
      userId: this.userData.UserID,
      catId: '',
      orderby: ""
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_ALL_CATEGORY, obj).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.customizeResponse(res);
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }

  customizeResponse(res) {
    let data = JSON.parse(res.data);
    data.AllCategory.forEach(element => {
      if (element.ScoreByuser % 1 == 0) {
        element.ScoreByuser = element.ScoreByuser + '.0';
      }
    });
    this.categoryList = data;
    this.categoryListCopy = this.helperService.deepClone(this.categoryList);
    console.log(JSON.stringify(this.categoryList));
  }

  async showPopOver(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: CategoryFilterPopupComponent,
      mode: 'ios',
      animated: true,
      event: ev,
      componentProps: {
        'filteron': this.filteron
      }
    });
    popover.onDidDismiss().then((result) => {
      if (result.data) {
        console.log(result);
        this.filteron = result.data.filteron;
        this.applyFilter(result.data.filteron);
      }
    });
    return await popover.present();
  }

  applyFilter(filter) {
    if (!this.categoryListCopy) {
      return;
    }
    if (!this.categoryListCopy.AllCategory.length) {
      return;
    }
    if (filter == 'All') {
      this.categoryList.AllCategory = this.categoryListCopy.AllCategory;
    } else if (filter == 'ltoh') {
      this.categoryList.AllCategory = this.categoryListCopy.AllCategory.sort((a, b) => { return a['ScoreByuser'] - b['ScoreByuser'] });
    } else if (filter == 'htol') {
      this.categoryList.AllCategory = this.categoryListCopy.AllCategory.sort((a, b) => { return b['ScoreByuser'] - a['ScoreByuser'] });
    } else {
      this.categoryList.AllCategory = this.categoryListCopy.AllCategory.filter((item) => {
        return item.CatName.toLowerCase() == filter.toLowerCase();
      });
    }
  }

  naviagetToOtherProfilePage(item) {
    let param = {
      id: item.FromUserID,
      FirstName: item.FirstName,
      LastName: item.LastName
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/other-home'], navigationExtras);
  }

  navigateToOtherHome(item) {
    let param = {
      id: item.FromUserID,
      FirstName: item.FirstName,
      LastName: item.LastName
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/other-home'], navigationExtras);
  }


  navigateBack(){
    this.location.back();
  }
}
