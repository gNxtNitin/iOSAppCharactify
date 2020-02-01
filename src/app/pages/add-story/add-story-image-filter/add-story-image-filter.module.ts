import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {SharedModule} from './../../../shared/module/shared.module';
import { AddStoryImageFilterPage } from './add-story-image-filter.page';
import { AngularCropperjsModule } from 'angular-cropperjs';  

const routes: Routes = [
  {
    path: '',
    component: AddStoryImageFilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    AngularCropperjsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddStoryImageFilterPage]
})
export class AddStoryImageFilterPageModule {}
