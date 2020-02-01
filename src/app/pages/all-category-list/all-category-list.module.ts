import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AllCategoryListPage } from './all-category-list.page';
import {SharedModule} from '../../shared/module/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AllCategoryListPage
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
  declarations: [AllCategoryListPage]
})
export class AllCategoryListPageModule {}
