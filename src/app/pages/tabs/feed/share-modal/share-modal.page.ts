import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.page.html',
  styleUrls: ['./share-modal.page.scss'],
})
export class ShareModalPage implements OnInit {

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
    this.modalController.dismiss();
  }
  sharePost(){
    this.modalController.dismiss({action: true, description: this.description});
  }

}
