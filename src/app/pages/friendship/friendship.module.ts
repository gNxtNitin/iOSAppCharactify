import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../shared/module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendshipPage } from './friendship.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: FriendshipPage }])
  ],
  declarations: [FriendshipPage]
})
export class FriendshipPageModule {}
