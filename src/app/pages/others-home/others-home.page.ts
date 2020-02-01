import { Component, ViewChild, ElementRef } from '@angular/core';
import { PopoverController, NavController, IonContent  } from '@ionic/angular';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { PopOverComponent } from './../../shared/module/pop-over/pop-over.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-others-home',
  templateUrl: 'others-home.page.html',
  styleUrls: ['others-home.page.scss']
})
export class OthersHomePage {

  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  @ViewChild("lineCanvas") lineCanvas: ElementRef;
  @ViewChild(IonContent) content: IonContent;

  private lineChart: Chart;
  paramData: any = {};
  public selectedLineChartOption = 'threeMonthslst';

  traitObj =
    {
      Honest: { Traitid: 301, name: 'Honesty', score: 0.0, img: 'assets/images/round-trait-circle/honest.png', class: 'honest-label' },
      Honorable: { Traitid: 302, name: 'Confidence', score: 0.0, img: 'assets/images/round-trait-circle/confidence.png', class: 'honorable-label' },
      Respectful: { Traitid: 303, name: 'Respectful', score: 0.0, img: 'assets/images/round-trait-circle/respectful.png', class: 'respectful-label' },
      Fair: { Traitid: 304, name: 'Fairness', score: 0.0, img: 'assets/images/round-trait-circle/fair.png', class: 'fair-label' },
      Forgiving: { Traitid: 305, name: 'Forgiving', score: 0.0, img: 'assets/images/round-trait-circle/forgive.png', class: 'forgiving-label' },
      Generous: { Traitid: 306, name: 'Generosity', score: 0.0, img: 'assets/images/round-trait-circle/generous.png', class: 'generous-label' },
      Courageous: { Traitid: 307, name: 'Courage', score: 0.0, img: 'assets/images/round-trait-circle/courageous.png', class: 'courageous-label' },
      Polite: { Traitid: 308, name: 'Adaptability', score: 0.0, img: 'assets/images/round-trait-circle/adaptability.png', class: 'polite-label' },
      Loving: { Traitid: 309, name: 'Compassion', score: 0.0, img: 'assets/images/round-trait-circle/compassion.png', class: 'loving-label' },
      Trustworthy: { Traitid: 310, name: 'Loyalty', score: 0.0, img: 'assets/images/round-trait-circle/loyalty.png', class: 'trustworthy-label' }
    };

  categoryObj: any = {
    Self: { id: 0, name: 'Self', score: 0.0 },
    Family: { id: 1, name: 'Family', score: 0.0 },
    Friends: { id: 2, name: 'Friends', score: 0.0 },
    Co_workers: { id: 3, name: 'Co-worker', score: 0.0 },
    Acquaintances: { id: 4, name: 'Acquaintances', score: 0.0 },
  }

  topTraits: any = [];

  totalRating = 0;
  averageRating = 0;
  userData: any = {};
  serverResponse: any = {};

  constructor(
    private service: PostProvider,
    private helperService: HelperProvider,
    private location: Location,
    public popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.route.queryParams.subscribe(params => {      
      if (params && params.special) {
        this.paramData = JSON.parse(params.special);
        this.content.scrollToTop(1500);
        this.getUserRatings();
      }
    });
  }

  ngOnInit() {
    
  }
  ionViewWillEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    //this.getUserRatings();
  }

  getUserRatings() {
    this.helperService.showLoader();
    let obj = this.helperService.deepClone(ServicesConstant.USER_MGMT.GET_OTHER_SCORE)
    obj.END_POINT = obj.END_POINT + this.paramData.id;
    let data ={
      UserId: this.paramData.id,
      currentUserId: this.userData.UserID
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_OTHER_SCORE, data).subscribe((res: any) => {
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
    this.serverResponse = data[0];
    if(this.serverResponse.AverageScoreAllTrait % 1 == 0){
      this.serverResponse.AverageScoreAllTrait = this.serverResponse.AverageScoreAllTrait + '.0';
    }
    this.loadLineChart();
    for (var property in this.traitObj) {
      if (this.traitObj.hasOwnProperty(property)) {
        data[0].Traitslst.forEach(element => {
          if (this.traitObj[property].Traitid == element.TraitsId) {
            this.traitObj[property].score = element.TraitsScore
          }
        });
      }
    }
    for (var prop in this.categoryObj) {
      data[0].ScorebyCategourylst.forEach(element => {
        if (this.categoryObj[prop].id == element.CatId) {
          this.categoryObj[prop].score = element.CatScore;
        }
      });
    }

    this.topTraits = this.serverResponse.Traitslst.sort((a, b) => b.TraitsScore - a.TraitsScore).slice(0, 3);
    for (var property in this.traitObj) {
      if (this.traitObj.hasOwnProperty(property)) {
        this.topTraits.forEach(element => {
          if (this.traitObj[property].Traitid == element.TraitsId) {
            element.img = this.traitObj[property].img;
            element.traitClass = this.traitObj[property].class;
          }
        });
      }
    }

    if (!this.serverResponse.TopCharactifierslst.length) {
      this.serverResponse.TopCharactifierslst = [
        { userProfilePic: 'assets/images/default-avatar.png', Score: 0 },
        { userProfilePic: 'assets/images/default-avatar.png', Score: 0 },
        { userProfilePic: 'assets/images/default-avatar.png', Score: 0 }
      ]
    }else {
      this.serverResponse.TopCharactifierslst.forEach(element => {
        if(element.Score % 1 == 0){
          element.Score = element.Score + '.0';
        }
      });
    }
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

  navigateToSelfRating() {
    this.router.navigate(['/self-rating']);
  }

  navigateToScoreSummaryByCategory(id, category) {
    let param = {
      id: id,
      scoreSummaryBy: category,
      userId: this.paramData.id
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/score-summary-by-category'], navigationExtras);
  }

  navigateToAllCategoryList() {
    this.router.navigate(['/all-category-list']);
  }

  navigateToScoreSummaryByTrait(id, trait) {
    let param = {
      id: id,
      scoreSummaryBy: trait,
      userId: this.paramData.id
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/score-summary-by-trait'], navigationExtras);
  }

  segmentChanged(e) {
    this.selectedLineChartOption = e.detail.value;
    this.loadLineChart();
  }

  loadLineChart() {
    if(this.lineChart)
    {
      this.lineChart.destroy()
    }
    let dataArray = [];
    let monthArray = [];
    if (this.serverResponse) {
      if (this.selectedLineChartOption == 'threeMonthslst') {
        this.serverResponse.threeMonthslst.forEach(element => {
          dataArray.push(element.value);
          monthArray.push(element.Monthname);
        });
      }

      if (this.selectedLineChartOption == 'sixMonthslst') {
        this.serverResponse.sixMonthslst.forEach(element => {
          dataArray.push(element.value);
          monthArray.push(element.Monthname);
        });
      }

      if (this.selectedLineChartOption == 'oneYearlst') {
        this.serverResponse.oneYearlst.forEach(element => {
          dataArray.push(element.value);
          monthArray.push(element.Monthname);
        });
      }

      if (this.selectedLineChartOption == 'begnninglst') {
        this.serverResponse.begnninglst.forEach(element => {
          dataArray.push(element.value);
          monthArray.push(element.Monthname);
        });
      }
    }
    this.lineChart = undefined;
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.tooltips.intersect = false;
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 9,
            bottom: 0
          }
        },
        animation: {
          animation: {
            duration: 10
          }
        },
        scales: {
          yAxes: [{
            display: false,
            gridLines:{
              display: false
            }            
          }],
          xAxes: [{
            gridLines: {
              drawBorder: false,
              display: false
            }
          }]
        }
      },
      data: {
        labels: monthArray,        
        datasets: [
          {

            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "#515151",
            borderCapStyle: "butt",
            pointStyle: 'circle',
            showLine: true,
            borderWidth: 5,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "#666666",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 6,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: dataArray,
            spanGaps: true,
            labels: '1'
          }
        ]
      }
    });
  }

  navigateToProfile() {
    let param = {
      id: this.paramData.id,      
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['/other-profile'], navigationExtras);
  }

  navigateToOtherHome(item) {    
    if(item.userId){

      this.paramData.id = item.userId;
      //this.getUserRatings();

      let param = {
        id: item.userId,
        FirstName: item.FirstName,
        LastName: item.LastName
      }
      let navigationExtras = {
        queryParams: {
          special: JSON.stringify(param)
        }
      };
      this.router.navigate(['/other-home'], navigationExtras);      
    } else{
      return false;
    } 
   
  }

  navigateBack(){
    this.location.back();
  }
}
