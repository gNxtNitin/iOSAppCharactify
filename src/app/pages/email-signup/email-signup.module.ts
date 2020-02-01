import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';
import { EmailSignupPage } from './email-signup.page';

const routes: Routes = [
  {
    path: '',
    component: EmailSignupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmailSignupPage]
})
export class EmailSignupPageModule {}
