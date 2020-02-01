import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../shared/module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OthersHomePage } from './others-home.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: OthersHomePage }])
  ],
  declarations: [OthersHomePage]
})
export class OthersHomePageModule {}
