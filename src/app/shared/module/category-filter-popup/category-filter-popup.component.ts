import { Component, OnInit, } from '@angular/core';
import { PopoverController, ModalController,NavParams } from '@ionic/angular';
@Component({
  selector: 'app-category-filter-popup',
  templateUrl: './category-filter-popup.component.html',
  styleUrls: ['./category-filter-popup.component.scss'],
})
export class CategoryFilterPopupComponent implements OnInit {
  CategoryFilterName = 'All';

  constructor(public popoverCtrl: PopoverController,private navParams: NavParams) {
    this.CategoryFilterName = this.navParams.get('filteron');
   }

  ngOnInit() {}

  onFilterChange(){
    this.popoverCtrl.dismiss({
      'filteron': this.CategoryFilterName
    });
  }
}
