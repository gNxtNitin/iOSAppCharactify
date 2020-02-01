import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

import { SignupOptionsPage } from './signup-options.page';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

const routes: Routes = [
  {
    path: '',
    component: SignupOptionsPage
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
  providers: [Facebook],
  declarations: [SignupOptionsPage]
})
export class SignupOptionsPageModule { }
