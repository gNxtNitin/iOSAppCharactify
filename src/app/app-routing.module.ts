import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteGuard } from './guards/route.guard';

const routes: Routes = [
  {path: 'score-summary-by-category', loadChildren: './pages/score-summary-by-category/score-summary-by-category.module#ScoreSummaryByCategoryPageModule'},
  {path: 'all-category-list', loadChildren: './pages/all-category-list/all-category-list.module#AllCategoryListPageModule'},
  {path: 'self-rating', loadChildren: './pages/self-rating/self-rating.module#SelfRatingPageModule'},
  {path: 'score-summary-by-trait', loadChildren: './pages/score-summary-by-trait/score-summary-by-trait.module#ScoreSummaryByTraitPageModule'},
  {path: 'my-connections', loadChildren: './pages/my-connections/my-connections.module#MyConnectionsPageModule'},
  {path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule'},
  {path: 'frienship', loadChildren: './pages/friendship/friendship.module#FriendshipPageModule'},

  {path: 'other-home', loadChildren: './pages/others-home/others-home.module#OthersHomePageModule'},

  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: '', loadChildren: './pages/app-intro/app-intro.module#AppIntroPageModule', canActivate: [RouteGuard] },
  { path: 'login-signup', loadChildren: './pages/login-signup/login-signup.module#LoginSignupPageModule' },
  { path: 'signup-options', loadChildren: './pages/signup-options/signup-options.module#SignupOptionsPageModule' },
  { path: 'email-signup', loadChildren: './pages/email-signup/email-signup.module#EmailSignupPageModule' },
  { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'otp-verification', loadChildren: './pages/otp-verification/otp-verification.module#OtpVerificationPageModule' },
  { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'lets-begin', loadChildren: './pages/lets-begin/lets-begin.module#LetsBeginPageModule' },
  { path: 'my-connections', loadChildren: './pages/my-connections/my-connections.module#MyConnectionsPageModule' },
  { path: 'others-rating', loadChildren: './pages/others-rating/others-rating.module#OthersRatingPageModule' },
  { path: 'my-profile', loadChildren: './pages/my-profile/my-profile.module#MyProfilePageModule' },
  { path: 'other-profile', loadChildren: './pages/other-profile/other-profile.module#OtherProfilePageModule' },  
  { path: 'gallery', loadChildren: './pages/add-feed/gallery/gallery.module#GalleryPageModule' },
  { path: 'image-filter', loadChildren: './pages/add-feed/image-filter/image-filter.module#ImageFilterPageModule' },
  { path: 'add-story-gallery', loadChildren: './pages/add-story/add-story-gallery/add-story-gallery.module#AddStoryGalleryPageModule' },
  { path: 'add-story-image-filter', loadChildren: './pages/add-story/add-story-image-filter/add-story-image-filter.module#AddStoryImageFilterPageModule' },
  { path: 'add-story-description', loadChildren: './pages/add-story/add-story-description/add-story-description.module#AddStoryDescriptionPageModule' },
  { path: 'add-description', loadChildren: './pages/add-feed/add-description/add-description.module#AddDescriptionPageModule' },
  { path: 'accept-terms-conditions', loadChildren: './pages/accept-terms-conditions/accept-terms-conditions.module#AcceptTermsConditionsPageModule' },
  { path: 'after-intro1', loadChildren: './pages/after-intro1/after-intro1.module#AfterIntro1PageModule' },
  { path: 'after-intro2', loadChildren: './pages/after-intro2/after-intro2.module#AfterIntro2PageModule' },
  { path: 'notification-detail', loadChildren: './pages/notification-detail/notification-detail.module#NotificationDetailPageModule' },
  { path: 'my-posts', loadChildren: './pages/my-posts/my-posts.module#MyPostsPageModule' },
  { path: 'faq', loadChildren: './pages/f-a-q/f-a-q.module#FAQPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
