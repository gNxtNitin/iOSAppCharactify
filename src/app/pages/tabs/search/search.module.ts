import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPage } from './search.page';
import {SharedModule} from './../../../shared/module/shared.module';
import { SearchPipe } from './../../../helper-services/list-filter.pipe';
import { PhoneuserFilterPipe } from './../../../shared/filters/phoneuser-filter.pipe';
import {SendContactMsgModalPage} from './send-contact-msg-modal/send-contact-msg-modal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SearchPage }])
  ],
  declarations: [SearchPage, SearchPipe,PhoneuserFilterPipe, SendContactMsgModalPage],
  entryComponents: [SendContactMsgModalPage]
})
export class SearchPageModule {}
