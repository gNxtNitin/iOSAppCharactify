import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PostProvider } from './api-provider/api.services';
import { HelperProvider } from './helper-services/helper.services';
import { DataService } from './helper-services/param-data.service';
import { ContactDataService } from './helper-services/contacts-provider.service';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/module/shared.module';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Network } from '@ionic-native/network/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
// import { PhoneuserFilterPipe } from './shared/filters/phoneuser-filter.pipe';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { ImageResizer } from '@ionic-native/image-resizer/ngx';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
// import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import 'hammerjs';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AngularFontAwesomeModule
  ],
  providers: [
    // MobileAccessibility,
    StatusBar,
    PostProvider,
    HelperProvider,
    MediaCapture,
    DataService,
    ContactDataService,
    GooglePlus,
    SplashScreen,
    Camera,
    Contacts,
    SocialSharing,
    PhotoLibrary,
    Network,
    Base64,
    ImageResizer,
    ImagePicker,
    FCM,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
