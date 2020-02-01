import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgOtpInputModule } from  'ng-otp-input';
import { OtpVerificationPage } from './otp-verification.page';

const routes: Routes = [
  {
    path: '',
    component: OtpVerificationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgOtpInputModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OtpVerificationPage]
})
export class OtpVerificationPageModule {}
