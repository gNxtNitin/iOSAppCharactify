import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedPage } from './feed.page';
import { ReactionsComponent } from './reactions/reactions.component';
import { PostImageViewerPage } from './post-image-viewer/post-image-viewer.page';
import { ViewReactionsListPage } from './view-reactions-list/view-reactions-list.page';
import { ViewCommentsListPage } from './view-comment-list/view-comment-list.page';
import { ShareModalPage } from './share-modal/share-modal.page';
import { UpdateCommentModalPage } from './update-comment-modal/update-comment-modal.page';
import {SharedModule} from './../../../shared/module/shared.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FeedTimeAgoPipe } from './../../../shared/pipes/feed-time-ago.pipe';
import {UpdateFeedModalPage} from './update-feed-modal/update-feed-modal.page';
import { SearchFeedConnectionPipe } from './../../../helper-services/connection-list-filter.pipe';

import {AddTagModalPage} from './add-tag-modal/add-tag-modal.page';

import { FeedWalkThroughComponent } from './walk-through/home-walk-through.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    AngularFontAwesomeModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FeedPage }])
  ],
  declarations: [SearchFeedConnectionPipe, AddTagModalPage, FeedWalkThroughComponent, FeedTimeAgoPipe, UpdateCommentModalPage,UpdateFeedModalPage, FeedPage, ReactionsComponent, PostImageViewerPage, ViewReactionsListPage, ViewCommentsListPage, ShareModalPage],
  entryComponents: [AddTagModalPage, FeedWalkThroughComponent, UpdateCommentModalPage,UpdateFeedModalPage, ReactionsComponent, PostImageViewerPage, ViewReactionsListPage, ViewCommentsListPage, ShareModalPage]
})
export class FeedPageModule {}
