import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';
import { ErrorHandlerComponent } from './../../../../shared/module/error-handler/error-handler.component';
import { PostProvider } from './../../../../api-provider/api.services';
import { ServicesConstant } from './../../../../api-provider/end-points';
import { HelperProvider } from './../../../../helper-services/helper.services';
@Component({
  selector: 'app-add-tag-modal',
  templateUrl: './add-tag-modal.page.html',
  styleUrls: ['./add-tag-modal.page.scss'],
})
export class AddTagModalPage implements OnInit {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent; 
  userData: any = {};
  taggedList:any=[];
  searchFriends:any = '';
  connectionList: any = [];
  objectFromParent: any;
  feedData:any = {};

  constructor(
    private modalController: ModalController,
    private service: PostProvider,
    private helperService: HelperProvider,
    private navParams: NavParams,
    public actionSheetController: ActionSheetController
  ) {    
    this.userData = JSON.parse(localStorage.getItem('signUp'));    
    this.feedData = JSON.parse(JSON.stringify(this.navParams.get('selectedTags')));
    this.objectFromParent = this.feedData.taggingslst;
  }

  ngOnInit() {
    this.getMyConnections();
  }



  getMyConnections() {
    this.helperService.showLoader();
    let data = {
      UserID: this.userData.UserID,      
      UserName: ""
    }
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.GET_TAG_LIST_SEARCH, data).subscribe((res: any) => {
      this.helperService.dismissLoader();
      if (res.code == 1001) {
        this.connectionList = JSON.parse(res.data).ConnectionSearchList;
        this.filterTagList();        
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
      this.helperService.dismissLoader();
    });
  }
  filterTagList(){
    let result = this.connectionList.filter((o1)=>{      
      return this.objectFromParent.some((o2)=>{
          return o1.UserId === o2.Touserid;          // assumes unique id
      });
  })  

  let itemNotInTagList = this.connectionList.filter((o1)=>{      
    return !result.some((o2)=>{
        return o1.UserId === o2.UserId;          // assumes unique id
    });
})

  this.objectFromParent = itemNotInTagList;
  this.taggedList = result;
    
  }

  close() {
    this.modalController.dismiss();
  }
  addTag() {        
    let list:any = [];
    this.taggedList.forEach(element => {
      list.push({
        userid: element.UserId 
      })
    });

    let data = {
      FeedID: this.feedData.feedID,
      FromUserID: this.userData.UserID,
      taggingslst:list
    }
    
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_UPDATE_FEED_TAGS, data).subscribe((res: any) => {
      if (res.code == 1001) {        
        this.modalController.dismiss({ action: 'addTag', description: this.taggedList });
        this.erroHandler.showErrorToast('Tag updated successfully.');
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    })
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
