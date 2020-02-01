import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-app-intro',
  templateUrl: './app-intro.page.html',
  styleUrls: ['./app-intro.page.scss'],
})
export class AppIntroPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(private router: Router,private navCtrl: NavController) { }

  slideOptions = {
    preloadImages: true,
    lazy: false,
    zoom: false    
  };
  hideContinueBtn = false;

  ngOnInit() {
  }

  ContinueToNextSlide() {
    this.slides.getActiveIndex().then(index => {
      this.slides.slideNext();     
      if (index === 4) {
        this.router.navigateByUrl('/login-signup');
      }
    });
  }

  updateStatus(excitedStatus) {
    let data: any = { isExcited: excitedStatus };
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(data)
      }
    };
    this.navCtrl.navigateForward(['/after-intro2/'], navigationExtras);
  }

  test1(){
    this.slides.getActiveIndex().then(index => {
      if (index === 2) {        
      }
    });
  }

  test2(){
    this.slides.getActiveIndex().then(index => {
      if (index !== 2) {        
      }
    });
  }
}
