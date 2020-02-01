import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

import { ScoreSummaryByTraitPage } from './score-summary-by-trait.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreSummaryByTraitPage
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
  declarations: [ScoreSummaryByTraitPage]
})
export class ScoreSummaryByTraitPageModule {}
