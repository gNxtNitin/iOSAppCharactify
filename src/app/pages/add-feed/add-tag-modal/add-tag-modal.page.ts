import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
@Component({
  selector: 'app-add-tag-modal',
  templateUrl: './add-tag-modal.page.html',
  styleUrls: ['./add-tag-modal.page.scss'],
})
export class AddTagModalPage implements OnInit {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  objectFromParent: any;
  userData: any = {};
  taggedList:any=[];
  searchFriends:any = '';

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public actionSheetController: ActionSheetController
  ) {
    this.objectFromParent = JSON.parse(JSON.stringify(this.navParams.get('selectedItems')));
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }
  addTag() {    
    this.modalController.dismiss({ action: 'addTag', description: this.taggedList });
  }

  addItemToTagList(item){
    this.taggedList.push(item);
    this.objectFromParent = this.objectFromParent.filter(elem => elem.UserId !== item.UserId); 
  }
  removeTaggedItem(item){
    this.taggedList = this.taggedList.filter(elem => elem.UserId !== item.UserId); 
    this.objectFromParent.push(item);
  }
}
