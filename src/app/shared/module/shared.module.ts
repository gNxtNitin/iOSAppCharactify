import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ErrorHandlerComponent} from './error-handler/error-handler.component';
import {PopOverComponent} from './pop-over/pop-over.component';
import {CategoryFilterPopupComponent} from './category-filter-popup/category-filter-popup.component'
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ErrorHandlerComponent, PopOverComponent, CategoryFilterPopupComponent],
  entryComponents: [PopOverComponent, CategoryFilterPopupComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports:[ErrorHandlerComponent]
})
export class SharedModule { }
