import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-after-intro1',
  templateUrl: './after-intro1.page.html',
  styleUrls: ['./after-intro1.page.scss'],
})
export class AfterIntro1Page implements OnInit {
  constructor(
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
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
}
