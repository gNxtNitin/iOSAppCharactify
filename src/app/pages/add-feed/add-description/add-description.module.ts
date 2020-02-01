import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from './../../../shared/module/shared.module';
import { IonicModule } from '@ionic/angular';
import { AddTagModalPage } from './../add-tag-modal/add-tag-modal.page';
import { AddDescriptionPage } from './add-description.page';
import { SearchConnectionPipe } from './../../../helper-services/connection-list-filter.pipe';
const routes: Routes = [
  {
    path: '',
    component: AddDescriptionPage
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
  declarations: [AddDescriptionPage, AddTagModalPage, SearchConnectionPipe],
  entryComponents:[AddTagModalPage]
})
export class AddDescriptionPageModule {}
