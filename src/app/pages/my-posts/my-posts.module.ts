import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyPostsPage } from './my-posts.page';
import { ReactionsComponent } from './reactions/reactions.component';
import { PostImageViewerPage } from './post-image-viewer/post-image-viewer.page';
import { ViewReactionsListPage } from './view-reactions-list/view-reactions-list.page';
import { ViewCommentsListPage } from './view-comment-list/view-comment-list.page';
import { ShareModalPage } from './share-modal/share-modal.page';
import { UpdateCommentModalPage } from './update-comment-modal/update-comment-modal.page';
import {SharedModule} from './../../shared/module/shared.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MyPostsTimeAgoPipe } from './../../shared/pipes/my-posts-time-ago.pipe';
import {UpdateFeedModalPage} from './update-feed-modal/update-feed-modal.page';

import { SearchMyFeedConnectionPipe } from './../../helper-services/connection-list-filter.pipe';
import {AddTagModalPage} from './add-tag-modal/add-tag-modal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    AngularFontAwesomeModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: MyPostsPage }])
  ],
  declarations: [SearchMyFeedConnectionPipe, AddTagModalPage, MyPostsTimeAgoPipe, UpdateCommentModalPage,UpdateFeedModalPage, MyPostsPage, ReactionsComponent, PostImageViewerPage, ViewReactionsListPage, ViewCommentsListPage, ShareModalPage],
  entryComponents: [AddTagModalPage, UpdateCommentModalPage,UpdateFeedModalPage, ReactionsComponent, PostImageViewerPage, ViewReactionsListPage, ViewCommentsListPage, ShareModalPage]
})
export class MyPostsPageModule {}
