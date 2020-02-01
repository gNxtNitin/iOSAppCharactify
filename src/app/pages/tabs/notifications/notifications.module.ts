import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsPage } from './notifications.page';
import {SharedModule} from './../../../shared/module/shared.module';
import { TimeAgoPipe } from './../../../shared/pipes/time-ago.pipe';
import { SendMsgModalPage } from "./send-msg-modal/send-msg-modal.page";

import { NotificationWalkThroughComponent } from './walk-through/home-walk-through.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: NotificationsPage }])
  ],
  declarations: [NotificationsPage, TimeAgoPipe, NotificationWalkThroughComponent, SendMsgModalPage],
  entryComponents: [NotificationWalkThroughComponent, SendMsgModalPage]
})
export class NotificationsPageModule {}
