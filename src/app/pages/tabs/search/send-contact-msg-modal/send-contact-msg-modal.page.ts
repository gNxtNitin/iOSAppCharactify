import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-send-contact-msg-modal',
  templateUrl: './send-contact-msg-modal.page.html',
  styleUrls: ['./send-contact-msg-modal.page.scss'],
})
export class SendContactMsgModalPage implements OnInit {

  userData: any = {};
  objectFromParent: any = {
    selectedItem: ''
  }
  description:any = '';

  constructor(private modalController: ModalController, private navParams: NavParams) { 
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.objectFromParent.selectedItem = this.navParams.get('selectedItems');
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  close() {  
  this.modalController.dismiss({data: this.objectFromParent});
  }
  sharePost(){
    this.modalController.dismiss({action: true, description: this.description});
  }



}
