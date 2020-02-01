import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-post-image-viewer',
  templateUrl: './post-image-viewer.page.html',
  styleUrls: ['./post-image-viewer.page.scss'],
})
export class PostImageViewerPage implements OnInit {

  objectFromParent: any = {
    selectedItem: '',
    selectedIndex: ''
  }

  constructor(private modalController: ModalController, private navParams: NavParams) { 
    this.objectFromParent.selectedItem = this.navParams.get('selectedItems');
    this.objectFromParent.selectedIndex = this.navParams.get('selectedIndex');
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

}
