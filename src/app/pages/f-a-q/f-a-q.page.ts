import { Component, OnInit, ViewChild } from '@angular/core';
import { PopOverComponent } from './../../shared/module/pop-over/pop-over.component';
import { PopoverController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-FAQ',
  templateUrl: './f-a-q.page.html',
  styleUrls: ['./f-a-q.page.scss'],
})
export class FAQPage implements OnInit {



  constructor(
    private location: Location,
    public alertController: AlertController,
    public popoverCtrl: PopoverController,
    private router: Router,
    public modalController: ModalController
  ) {
    setTimeout(()=>{
      $('#loadExternalURL').load('http://dev.gnxtsystems.com/charactify/faq.html');
    },1000)
    

   }

  ngOnInit() {

  }
  navigateBack() {
    this.location.back();
  }

}
