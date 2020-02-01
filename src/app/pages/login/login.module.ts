import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {SharedModule} from './../../shared/module/shared.module';

import { LoginPage } from './login.page';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [Facebook],
  declarations: [LoginPage]
})
export class LoginPageModule {}
