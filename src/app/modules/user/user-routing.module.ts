import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FavouritesComponent } from './components/favourites/favourites.component';

const routes: Routes = [
  {
    path: 'user', children: [
      { path: 'login', component: UserLoginComponent },
      { path: 'signup', component: UserRegistrationComponent },
      { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
      { path: 'favourites', component: FavouritesComponent, canActivate: [AuthGuard] },
      { path: 'edit-profile', component: UserRegistrationComponent, canActivate: [AuthGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
