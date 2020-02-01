import { Component, ViewChild, ElementRef } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tab-friendship',
  templateUrl: 'friendship.page.html',
  styleUrls: ['friendship.page.scss']
})
export class FriendshipPage {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;


  traitObj =
    {
      Honest: { Traitid: 301, name: 'Honesty', score: 0.0, img: 'assets/images/round-trait-circle/honest.png', class: 'honest-label' },
      Honorable: { Traitid: 302, name: 'Honorable', score: 0.0, img: 'assets/images/round-trait-circle/confidence.png', class: 'honorable-label' },
      Respectful: { Traitid: 303, name: 'Respectful', score: 0.0, img: 'assets/images/round-trait-circle/respectful.png', class: 'respectful-label' },
      Fair: { Traitid: 304, name: 'Fair', score: 0.0, img: 'assets/images/round-trait-circle/fair.png', class: 'fair-label' },
      Forgiving: { Traitid: 305, name: 'Forgiving', score: 0.0, img: 'assets/images/round-trait-circle/forgive.png', class: 'forgiving-label' },
      Generous: { Traitid: 306, name: 'Generous', score: 0.0, img: 'assets/images/round-trait-circle/generous.png', class: 'generous-label' },
      Courageous: { Traitid: 307, name: 'Courageous', score: 0.0, img: 'assets/images/round-trait-circle/courageous.png', class: 'courageous-label' },
      Polite: { Traitid: 308, name: 'Polite', score: 0.0, img: 'assets/images/round-trait-circle/adaptability.png', class: 'polite-label' },
      Loving: { Traitid: 309, name: 'Loving', score: 0.0, img: 'assets/images/round-trait-circle/compassion.png', class: 'loving-label' },
      Trustworthy: { Traitid: 310, name: 'Trustworthy', score: 0.0, img: 'assets/images/round-trait-circle/loyalty.png', class: 'trustworthy-label' }
    };

  categoryObj: any = {
    Self: { id: 0, name: 'Self', score: 0.0 },
    Family: { id: 1, name: 'Family', score: 0.0 },
    Friends: { id: 2, name: 'Friends', score: 0.0 },
    Co_workers: { id: 3, name: 'Co-workers', score: 0.0 },
    Acquaintances: { id: 4, name: 'Acquaintances', score: 0.0 },
  }

  topTraits: any = [];

  totalRating = 0;
  averageRating = 0;
  userData: any = {};
  serverResponse: any = {};
  paramData: any = {};
  showResponse = false;

  scoreGiven: any = {};
  scoreRecive: any = {};

  dummyData: any = {
    "connectedSince":
      [{ "ConnectedDate": "16 Sep 2019" }],
    "currentUser": [{
      "UserID": 2115, "FirstName": "ravi", "LastName": "tiwari",
      "UserProfilePic": "https://lh3.googleusercontent.com/a-/AAuE7mD1nUjwxZut3BOHfWBmXE1MmbxCL6piBKxImzbZrA",
      "ScoreDate": "2019-09-16T04:14:13.493", "AvgScore": 8.400000
    }],
    "friend": [{
      "UserID": 2119, "FirstName": "KRISHIKA", "LastName": "JHA",
      "UserProfilePic": "https://lh3.googleusercontent.com/a-/AAuE7mCKsWFCOBUHtIRmTliKGNEOk1m-ek-vsMsKzSP9XQ",
      "ScoreDate": "2019-09-16T02:02:14.273", "AvgScore": 9.300000
    }],
    "scoreGiven": [{ "TraitsID": 301, "Score": 10.00 }, { "TraitsID": 302, "Score": 9.00 }, { "TraitsID": 303, "Score": 4.00 },
    { "TraitsID": 304, "Score": 10.00 }, { "TraitsID": 305, "Score": 10.00 }, { "TraitsID": 306, "Score": 10.00 },
    { "TraitsID": 307, "Score": 10.00 }, { "TraitsID": 308, "Score": 10.00 }, { "TraitsID": 309, "Score": 3.00 },
    { "TraitsID": 310, "Score": 8.00 }],
    "scoreRecive": [{ "TraitsID": 301, "Score": 9.00 }, { "TraitsID": 302, "Score": 8.00 },
    { "TraitsID": 303, "Score": 10.00 }, { "TraitsID": 304, "Score": 10.00 }, { "TraitsID": 305, "Score": 9.00 }
      , { "TraitsID": 306, "Score": 8.00 }, { "TraitsID": 307, "Score": 10.00 }, { "TraitsID": 308, "Score": 10.00 },
    { "TraitsID": 309, "Score": 9.00 }, { "TraitsID": 310, "Score": 10.00 }]
  }
  constructor(
    private location: Location,
    private service: PostProvider,
    private helperService: HelperProvider,
    public popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {      
      if (params && params.special) {
        this.paramData = JSON.parse(params.special);
      }
    });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.getFriendshipRatings();
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  getFriendshipRatings() {
    this.helperService.showLoader();
    let data = {
      currentUserId: this.userData.UserID,
      friendUserId: this.paramData.id
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_FRIENDSHIP_DATA, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.customizeResponseData(JSON.parse(res.data));
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }

  customizeResponseData(data) {
    this.serverResponse = data;    
    
    this.scoreGiven = JSON.parse(JSON.stringify(this.traitObj));
    this.scoreRecive = JSON.parse(JSON.stringify(this.traitObj));    
    if (this.serverResponse.scoreGiven) {
      for (var property in this.scoreGiven) {
        if (this.traitObj.hasOwnProperty(property)) {
          this.serverResponse.scoreGiven.forEach(element => {
            if (this.scoreGiven[property].Traitid == element.TraitsID) {
              this.scoreGiven[property].score = element.Score
            }
          });
        }
      }
    }

    if (this.serverResponse.scoreRecive) {
      for (var property in this.scoreRecive) {
        if (this.traitObj.hasOwnProperty(property)) {
          this.serverResponse.scoreRecive.forEach(element => {
            if (this.scoreRecive[property].Traitid == element.TraitsID) {
              this.scoreRecive[property].score = element.Score
            }
          });
        }
      }
    }
    if (this.serverResponse.currentUser[0].AvgScore && this.serverResponse.currentUser[0].AvgScore % 1 == 0) {
      this.serverResponse.currentUser[0].AvgScore = this.serverResponse.currentUser[0].AvgScore + '.0';
    }
    if (this.serverResponse.friend[0].AvgScore && this.serverResponse.friend[0].AvgScore % 1 == 0) {
      this.serverResponse.friend[0].AvgScore = this.serverResponse.friend[0].AvgScore + '.0';
    }
    this.showResponse = true;

  }



  navigateToSelfRating() {
    this.router.navigate(['/self-rating']);
  }

  navigateToScoreSummaryByCategory(id) {
    let param = {
      id: id
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/score-summary-by-category'], navigationExtras);
  }

  navigateToProfile() {
    this.router.navigate(['/my-profile']);
  }

  naviagetToOtherRatingPage(item) {
    let param = {
      id: item.UserID,
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

  naviagetToHomePage(){
    this.router.navigate(['/tabs/home']);
  }

  navigateBack(){
    this.location.back();
  }

}
