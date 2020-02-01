import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-send-msg-modal',
  templateUrl: './send-msg-modal.page.html',
  styleUrls: ['./send-msg-modal.page.scss'],
})
export class SendMsgModalPage implements OnInit {

  userData: any = {};
  objectFromParent: any = {
    selectedItem: ''
  }
  description:any = '';

  constructor(private modalController: ModalController, private navParams: NavParams) { 
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.objectFromParent.selectedItem = this.navParams.get('selectedItems');
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
  }

  close() {  
  this.modalController.dismiss({data: this.objectFromParent});
  }
  sharePost(){
    this.modalController.dismiss({action: true, description: this.description});
  }



}
