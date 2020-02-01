import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../../../shared/module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomeWalkThroughComponent } from './walk-through/home-walk-through.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  declarations: [HomePage, HomeWalkThroughComponent],
  entryComponents: [HomeWalkThroughComponent]
})
export class HomePageModule { }
