import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs.router.module';
import { TabsPage } from './tabs.page';
import {SharedModule} from './../../shared/module/shared.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import{HomeWalkThroughComponent} from './walk-through/home-walk-through.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    TabsPageRoutingModule,
    AngularFontAwesomeModule
  ],  
  declarations:[TabsPage, HomeWalkThroughComponent],
  entryComponents:[HomeWalkThroughComponent]  
})
export class TabsPageModule {}
