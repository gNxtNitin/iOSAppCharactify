import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

import { MyConnectionsPage } from './my-connections.page';
import { SendMsgModalPage } from './send-msg-modal/send-msg-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MyConnectionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyConnectionsPage, SendMsgModalPage],
  entryComponents:[SendMsgModalPage]
})
export class MyConnectionsPageModule {}
