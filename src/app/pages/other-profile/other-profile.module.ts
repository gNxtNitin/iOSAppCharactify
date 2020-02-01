import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {SharedModule} from './../../shared/module/shared.module';
import { OtherProfilePage } from './other-profile.page';

const routes: Routes = [
  {
    path: '',
    component: OtherProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OtherProfilePage],
  entryComponents: []
})
export class OtherProfilePageModule {}
