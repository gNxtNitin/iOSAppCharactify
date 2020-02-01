import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { HelperProvider } from './../../../helper-services/helper.services';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
@Component({
  selector: 'app-education-update-modal',
  templateUrl: './education-update-modal.component.html',
  styleUrls: ['./education-update-modal.component.scss'],
})
export class EducationUpdateModalComponent implements OnInit {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  modalDetails: any = {};
  educationProfileUpdateForm: FormGroup;
  workProfileUpdateForm: FormGroup;
  ProfileUpdateForm: FormGroup;
  userData: any = {};
  phoneNo:any;

  formSubmitted: any = false;
  objectFromParent: any = {
    selectedItem: '',
    selectedComponent: ''
  }
  formType: any = {
    educationForm: false,
    workExpForm: false,
    profileForm: false,
  }
  constructor(private service: PostProvider, private helperService: HelperProvider, private formBuilder: FormBuilder, private modalController: ModalController, private navParams: NavParams) {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.objectFromParent.selectedItem = this.navParams.get('selectedItem');
    this.objectFromParent.selectedComponent = this.navParams.get('selectedComponent');
    if (this.objectFromParent.selectedComponent == 'EDUCATION') {
      this.educationProfileUpdateForm = formBuilder.group({
        UserSchoolID: [0],
        SchoolName: ['', Validators.required],
        Fromdate: [''],
        Todate: [''],
        Isgraduated: [1],
        Ispublic: [1],
        Description: [''],
        TypeofSchool: [''],
        userId: ['']
      });
      if (this.objectFromParent.selectedItem) {
        let fromdateObj:any = new Date(this.objectFromParent.selectedItem.fromdate)
        let fromDate = fromdateObj.toISOString().split("T")[0];
        let todateObj:any = new Date(this.objectFromParent.selectedItem.ToDate)
        let toDate = todateObj.toISOString().split("T")[0];
        this.educationProfileUpdateForm.controls['userId'].setValue(this.objectFromParent.selectedItem.userid);
        this.educationProfileUpdateForm.controls['UserSchoolID'].setValue(this.objectFromParent.selectedItem.UserSchoolID);
        this.educationProfileUpdateForm.controls['SchoolName'].setValue(this.objectFromParent.selectedItem.schoolname);
        this.educationProfileUpdateForm.controls['Fromdate'].setValue(fromDate);
        this.educationProfileUpdateForm.controls['Todate'].setValue(toDate);
        this.educationProfileUpdateForm.controls['Isgraduated'].setValue(this.objectFromParent.selectedItem.IsGraduated);
        this.educationProfileUpdateForm.controls['Ispublic'].setValue(this.objectFromParent.selectedItem.IsPublic);
        this.educationProfileUpdateForm.controls['Description'].setValue(this.objectFromParent.selectedItem.Description);       
      }
    } else if (this.objectFromParent.selectedComponent == 'WORK') {
      this.workProfileUpdateForm = formBuilder.group({
        UserEducationID: [''],
        userId: [''],
        Companyname: ['', Validators.required],
        Address: [''],
        Position: [''],
        Fromdate: [''],
        Todate: [''],
        Isstillworking: [''],
        Description: [''],
        Ispublic: ['']
      });
      
      if (this.objectFromParent.selectedItem) {
        let fromdateObj:any = new Date(this.objectFromParent.selectedItem.fromdate)
        let fromDate = fromdateObj.toISOString().split("T")[0];
        let todateObj:any = new Date(this.objectFromParent.selectedItem.ToDate)
        let toDate = todateObj.toISOString().split("T")[0];
        this.workProfileUpdateForm.controls['UserEducationID'].setValue(this.objectFromParent.selectedItem.WorkDetailsId);
        this.workProfileUpdateForm.controls['userId'].setValue(this.objectFromParent.selectedItem.userid);
        this.workProfileUpdateForm.controls['Companyname'].setValue(this.objectFromParent.selectedItem.CompanyName);
        this.workProfileUpdateForm.controls['Address'].setValue(this.objectFromParent.selectedItem.Address);
        this.workProfileUpdateForm.controls['Position'].setValue(this.objectFromParent.selectedItem.Position);
        this.workProfileUpdateForm.controls['Fromdate'].setValue(fromDate);
        this.workProfileUpdateForm.controls['Todate'].setValue(toDate);
        this.workProfileUpdateForm.controls['Isstillworking'].setValue(this.objectFromParent.selectedItem.IsStillWorking);
        this.workProfileUpdateForm.controls['Description'].setValue(this.objectFromParent.selectedItem.Description);
        this.workProfileUpdateForm.controls['Ispublic'].setValue(this.objectFromParent.selectedItem.IsPublic);
      }
    } else if (this.objectFromParent.selectedComponent == 'PROFILE') {
      this.ProfileUpdateForm = formBuilder.group({
        firstName: [''],
        lastName: [''],
        dateOfBirth: [''],
        city: [''],
        phone: [''],
        gender: [''],
        AppUserName: ['', Validators.required]
      });

      this.ProfileUpdateForm.controls['firstName'].setValue(this.objectFromParent.selectedItem.firstname);
      this.ProfileUpdateForm.controls['lastName'].setValue(this.objectFromParent.selectedItem.LastName);
      this.ProfileUpdateForm.controls['dateOfBirth'].setValue(this.objectFromParent.selectedItem.DateOfBirth);
      this.ProfileUpdateForm.controls['phone'].setValue(this.objectFromParent.selectedItem.Phone);
      this.ProfileUpdateForm.controls['gender'].setValue(this.objectFromParent.selectedItem.Gender);
      this.ProfileUpdateForm.controls['city'].setValue(this.objectFromParent.selectedItem.City);
      this.ProfileUpdateForm.controls['AppUserName'].setValue(this.objectFromParent.selectedItem.AppUserName);
    }
  }

  ngOnInit() { }

  onProfileSubmit(ev) {
    let formData: any;
    if (this.objectFromParent.selectedComponent == 'EDUCATION') {
      formData = this.educationProfileUpdateForm.value;
      var fromdate = new Date(this.educationProfileUpdateForm.controls['Fromdate'].value);
      var todate = new Date(this.educationProfileUpdateForm.controls['Todate'].value);
      if (fromdate && todate) {
        if (fromdate.getFullYear() > todate.getFullYear()) {
          this.erroHandler.showErrorToast('To date should be greater than from date. Please choose valid year.', 'error');
          return;
        }
      }
      this.modalController.dismiss(formData);
    }
    if (this.objectFromParent.selectedComponent == 'WORK') {
      formData = this.workProfileUpdateForm.value;
      var fromdate = new Date(this.workProfileUpdateForm.controls['Fromdate'].value);
      var todate = new Date(this.workProfileUpdateForm.controls['Todate'].value);
      if (fromdate && todate) {
        if (fromdate.getFullYear() > todate.getFullYear()) {
          this.erroHandler.showErrorToast('To date should be greater than from date. Please choose valid year.', 'error');
          return;
        }
      }
      this.modalController.dismiss(formData);
    }
    if (this.objectFromParent.selectedComponent == 'PROFILE') {
      formData = this.ProfileUpdateForm.value;
      this.submitProfileDetailsToApi(formData);
    }
  }
  validate(evt:any) {
    var theEvent = evt || window.event;
    // Handle paste
    if (theEvent.type === 'paste') {
        key = evt.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.stopPropagation();
    }
  }

  close() {
    this.modalController.dismiss();
  }

  submitProfileDetailsToApi(data) {
    data.userID = this.userData.UserID
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.UPDATE_PROFILE, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        if (res.data == "User name Already Exist") {
          this.erroHandler.showErrorToast('User name Already Exist, please try with another username.', 'error');
        } else {
          const currentUserStoredData = JSON.parse(localStorage.getItem('signUp'));
          currentUserStoredData.FirstName = data.firstName;
          currentUserStoredData.LastName = data.lastName;
          localStorage.setItem('signUp', JSON.stringify(currentUserStoredData));
          this.erroHandler.showErrorToast('Profile updated successfully');
          this.modalController.dismiss(data);
        }
      } else {
        this.erroHandler.showError(res.message);
      }
    }, error => {
      this.erroHandler.showError(error.error.data);
      this.helperService.dismissLoader();
    });
  }

}
interface Event {
  clipboardData: any;
}
