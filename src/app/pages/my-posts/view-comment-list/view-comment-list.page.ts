import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ErrorHandlerComponent } from './../../../shared/module/error-handler/error-handler.component';
import { PostProvider } from './../../../api-provider/api.services';
import { ServicesConstant } from './../../../api-provider/end-points';
import { HelperProvider } from './../../../helper-services/helper.services';
import { UpdateCommentModalPage } from './../update-comment-modal/update-comment-modal.page';
@Component({
  selector: 'app-view-comment-list',
  templateUrl: './view-comment-list.page.html',
  styleUrls: ['./view-comment-list.page.scss'],
})
export class ViewCommentsListPage implements OnInit {
  @ViewChild('errorHandler') erroHandler: ErrorHandlerComponent;
  objectFromParent: any = {
    selectedItem: '',
    noComments: 0
  }
  userData: any = {};
  commentDec: any = '';
  commentPeoplelist: any = [];
  commentResponse: any;

  constructor(private service: PostProvider,
    private helperService: HelperProvider,
    private modalController: ModalController,
    private navParams: NavParams,
    private router: Router,
    public actionSheetController: ActionSheetController
  ) {
    this.userData = JSON.parse(localStorage.getItem('signUp'));
    this.objectFromParent.selectedItem = [];
    this.commentDec = '';
    this.objectFromParent.selectedItem = JSON.parse(JSON.stringify(this.navParams.get('selectedItems')));    

  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss({ data: this.objectFromParent });
  }

  addComment() {
    let data = {
      userID: this.userData.UserID,
      feedID: this.objectFromParent.selectedItem.feedID,
      reactionType: "65",
      description: this.commentDec
    }
    this.helperService.showLoader();
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.ADD_REACTIONS, data).subscribe((res: any) => {
      if (res.code == 1001) {
        let dat = JSON.parse(res.data)[0];
        if (dat) {
          this.objectFromParent.selectedItem.usercommentLst = dat.usercommentLst;
          this.objectFromParent.selectedItem.noComments = dat.noComments;
          this.commentDec = '';
        }
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.helperService.showLoader();
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  removeComment() {
    
    this.modalController.dismiss({ action: 'removeComment', list: this.commentResponse });
  }

  async pressEvent(selectedComment) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Comment options',
      buttons: [{
        text: 'Remove',
        handler: () => {
          this.proceedToRemoveComment(selectedComment);
          
        }
      }, {
        text: 'Edit',
        handler: () => {
          this.updateCommentModal(selectedComment);
          
        }

      }]
    });
    await actionSheet.present();
  }

  proceedToRemoveComment(selectedComment) {
    let data = {
      reactionID: selectedComment.ReactionID,
      userID: selectedComment.UserID,
      feedID: selectedComment.feedID
    }

    this.service.callServiceFunction(ServicesConstant.USER_MGMT.DELETE_COMMENT, data).subscribe((res: any) => {
      if (res.code == 1001) {
        let dat = JSON.parse(res.data)[0];
        if (dat) {
          this.objectFromParent.selectedItem.usercommentLst = dat.usercommentLst;
          this.objectFromParent.selectedItem.noComments = dat.noComments;
          this.erroHandler.showErrorToast('Comment removed successfully.');
        } else {
          this.objectFromParent.selectedItem.usercommentLst = [];
          this.objectFromParent.selectedItem.noComments = 0;
        }
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
  }

  async updateCommentModal(item) {
    const modal = await this.modalController.create({
      component: UpdateCommentModalPage,
      cssClass: 'custom-share-modal',
      componentProps: {
        'selectedItems': item
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        if (data.data) {
          this.proceedToUpdateComment(item, data.data.description);
        }
      });
    return await modal.present();
  }

  proceedToUpdateComment(selectedComment, des) {
    let data = {
      reactionID: selectedComment.ReactionID,
      userID: selectedComment.UserID,
      feedID: selectedComment.feedID,
      ReactionType: "65",
      description: des
    }

    this.service.callServiceFunction(ServicesConstant.USER_MGMT.UPDATE_COMMENT, data).subscribe((res: any) => {
      if (res.code == 1001) {
        let dat = JSON.parse(res.data)[0];
        this.objectFromParent.selectedItem.usercommentLst = dat.usercommentLst;
        this.objectFromParent.selectedItem.noComments = dat.noComments;
        this.erroHandler.showErrorToast('Comment updated successfully.');
      } else {
        this.erroHandler.showErrorToast(res.message, 'error');
      }
    }, error => {
      this.erroHandler.showErrorToast(error.error.data, 'error');
    });
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
    this.modalController.dismiss({ data: this.objectFromParent });
    this.router.navigate(['/other-home'], navigationExtras);
  }


}
