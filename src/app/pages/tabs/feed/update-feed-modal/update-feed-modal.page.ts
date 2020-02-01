import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-update-feed-modal',
  templateUrl: './update-feed-modal.page.html',
  styleUrls: ['./update-feed-modal.page.scss'],
})
export class UpdateFeedModalPage implements OnInit {
  userData: any = {};
  objectFromParent: any = {
    selectedItem: ''
  }
  description:any = '';

  constructor(private modalController: ModalController, private navParams: NavParams) { 
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.objectFromParent.selectedItem = this.navParams.get('selectedItems');
    console.log(this.objectFromParent.selectedItem);
    this.description = this.objectFromParent.selectedItem.description;
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  close() {
    this.modalController.dismiss();
  }
  
  updateComment(){
    this.modalController.dismiss({action: 'updateFeed', description: this.description});
  }

}
