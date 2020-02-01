import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-view-reactions-list',
  templateUrl: './view-reactions-list.page.html',
  styleUrls: ['./view-reactions-list.page.scss'],
})
export class ViewReactionsListPage implements OnInit {

  objectFromParent: any = {
    selectedItem: ''
  }
  reactionsPeoplelist:any = [];

  constructor(private modalController: ModalController, private navParams: NavParams, private router: Router) { 
    this.objectFromParent.selectedItem = [];
    this.objectFromParent.selectedItem = JSON.parse(JSON.stringify(this.navParams.get('selectedItems')));
    this.customizeResponse();
  }

  ngOnInit() {
  }

  customizeResponse(){
    let list: any = [];
    this.objectFromParent.selectedItem.forEach(element => {
      element.selected = false;
      element.userRectionsLst.forEach(users => {
        list.push(users);  
      });      
    });
    this.objectFromParent.selectedItem.push({
      ReactionType: 'All',
      userRectionsLst: list
    });

    this.objectFromParent.selectedItem.reverse();
    this.objectFromParent.selectedItem[0].selected = true;
    this.reactionsPeoplelist = this.objectFromParent.selectedItem[0].userRectionsLst;
  }

  selectedSegment(item){
    this.objectFromParent.selectedItem.forEach(element => {
      element.selected = false;
    });
    item.selected = true;
    this.reactionsPeoplelist = item.userRectionsLst;
  }

  close() {
    this.modalController.dismiss();
  }

  naviagetToOtherRatingPageFromComment(item) {
    let param = {
      id: item.UserID,
      FirstName: item.Name,
      LastName: item.LastName
    }
    let navigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.modalController.dismiss();
    this.router.navigate(['/other-home'], navigationExtras);
  }

}
