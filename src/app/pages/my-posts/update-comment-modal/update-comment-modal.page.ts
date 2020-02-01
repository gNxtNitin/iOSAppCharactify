import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-update-comment-modal',
  templateUrl: './update-comment-modal.page.html',
  styleUrls: ['./update-comment-modal.page.scss'],
})
export class UpdateCommentModalPage implements OnInit {

  userData: any = {};
  objectFromParent: any = {
    selectedItem: ''
  }
  description:any = '';

  constructor(private modalController: ModalController, private navParams: NavParams) { 
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.objectFromParent.selectedItem = this.navParams.get('selectedItems');
    this.description = this.objectFromParent.selectedItem.Description;
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }
  updateComment(){
    this.modalController.dismiss({action: true, description: this.description});
  }

}
