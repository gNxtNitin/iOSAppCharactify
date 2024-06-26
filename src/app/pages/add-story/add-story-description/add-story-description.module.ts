import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

import { AddStoryDescriptionPage } from './add-story-description.page';

const routes: Routes = [
  {
    path: '',
    component: AddStoryDescriptionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddStoryDescriptionPage]
})
export class AddStoryDescriptionPageModule {}
