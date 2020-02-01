import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

import { AddStoryGalleryPage } from './add-story-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: AddStoryGalleryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddStoryGalleryPage]
})
export class AddStoryGalleryPageModule {}
