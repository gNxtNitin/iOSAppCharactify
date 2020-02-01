import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {SharedModule} from './../../shared/module/shared.module';
import { AngularCropperjsModule } from 'angular-cropperjs';  
import { MyProfilePage } from './my-profile.page';
import { EducationUpdateModalComponent } from './education-update-modal/education-update-modal.component';
import { ProfileImageCropComponent } from './profile-image-crop/profile-image-crop.component';

const routes: Routes = [
  {
    path: '',
    component: MyProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    AngularCropperjsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyProfilePage, EducationUpdateModalComponent, ProfileImageCropComponent],
  entryComponents: [EducationUpdateModalComponent, ProfileImageCropComponent]
})
export class MyProfilePageModule {}
