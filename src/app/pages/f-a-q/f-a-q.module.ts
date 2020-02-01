import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FAQPage} from './f-a-q.page';

const routes: Routes = [
  {
    path: '',
    component: FAQPage
  }
];

@NgModule({
  imports: [
    CommonModule,    
    IonicModule,    
    RouterModule.forChild(routes)
  ],
  declarations: [FAQPage]
})
export class FAQPageModule {}
