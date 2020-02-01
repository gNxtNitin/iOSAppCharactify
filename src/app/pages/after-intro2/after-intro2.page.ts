import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-after-intro2',
  templateUrl: './after-intro2.page.html',
  styleUrls: ['./after-intro2.page.scss'],
})
export class AfterIntro2Page implements OnInit {
  isExcited = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        console.log(params.special);
        let data = JSON.parse(params.special);
        this.isExcited = data.isExcited;
      }
    });
  }

  ngOnInit() {
  }

  finish() {
    localStorage.setItem('tutorialComplete', JSON.stringify('true'));
    this.router.navigateByUrl('/login-signup');
  }
}
