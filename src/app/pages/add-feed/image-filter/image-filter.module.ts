import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImageFilterPage } from './image-filter.page';
import { AngularCropperjsModule } from 'angular-cropperjs';  

const routes: Routes = [
  {
    path: '',
    component: ImageFilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularCropperjsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ImageFilterPage]
})
export class ImageFilterPageModule {}
