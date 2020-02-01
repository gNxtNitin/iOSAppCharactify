import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { PostProvider } from './../../api-provider/api.services';
import { ServicesConstant } from './../../api-provider/end-points';
import { HelperProvider } from './../../helper-services/helper.services';
import { ErrorHandlerComponent } from './../../shared/module/error-handler/error-handler.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-score-summary-by-trait',
  templateUrl: './score-summary-by-trait.page.html',
  styleUrls: ['./score-summary-by-trait.page.scss'],
})
export class ScoreSummaryByTraitPage implements OnInit {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  public paramData: any;
  private lineChart: Chart;
  public selectedLineChartOption = 'threeMonthslst';

  topCharactifierslst = [
    { score: 0, FirstName: '', userpic: '', UserID: '', LastName: '' },
    { score: 0, FirstName: '', userpic: '', UserID: '', LastName: '' },
    { score: 0, FirstName: '', userpic: '', UserID: '', LastName: '' },
    { score: 0, FirstName: '', userpic: '', UserID: '', LastName: '' },
    { score: 0, FirstName: '', userpic: '', UserID: '', LastName: '' }
  ]

  categoryObj: any = {
    Self: { id: 0, name: 'Self', score: 0 },
    Family: { id: 1, name: 'Family', score: 0 },
    Friends: { id: 2, name: 'Friends', score: 0 },
    Co_workers: { id: 3, name: 'Co-workers', score: 0 },
    Acquaintances: { id: 4, name: 'Acquaintances', score: 0 }
  }

  totalRating = 0;
  averageRating = 0;
  userData: any = {};
  serverResponse: any = {};

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private service: PostProvider,
    private helperService: HelperProvider,
    public popoverCtrl: PopoverController,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.paramData = JSON.parse(params.special);
      }
    });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.getScoreSummarybytraits();
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  getScoreSummarybytraits() {
    this.helperService.showLoader();
    let obj = {
      UserId: this.paramData.userId ? this.paramData.userId : this.userData.UserID,
      Traitid: this.paramData.id
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.SCORE_SUMMARY_BY_TRAITS, obj).subscribe((res: any) => {
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
    for (var prop in this.categoryObj) {
      data[0].ScorebyCategourylst.forEach(element => {
        if (this.categoryObj[prop].id == element.CatId) {
          this.categoryObj[prop].score = element.CatScore;
        }
      });
    }
    data[0].TopCharactifierslst.forEach((element, i) => {
      this.topCharactifierslst[i].score = element.Score;
      this.topCharactifierslst[i].FirstName = element.FirstName;
      this.topCharactifierslst[i].userpic = element.userProfilePic;
      this.topCharactifierslst[i].UserID = element.userId;
      this.topCharactifierslst[i].LastName = element.LastName;
    });
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
            spanGaps: false
          }
        ]
      }
    });
  }

  naviagetToOtherHomePage(item) {
    if (item.UserID) {
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
  }

  navigateBack(){
    this.location.back();
  }

}
