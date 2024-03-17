import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "error/:errorCode", component: ErrorComponent },
  { path: "user", loadChildren: () => import("./modules/user/user.module").then(module => module.UserModule) },
  { path: "amazon", loadChildren: () => import("./modules/amazon/amazon.module").then(module => module.AmazonModule) },
  { path: "meesho", loadChildren: () => import("./modules/meesho/meesho.module").then(module => module.MeeshoModule) },
  { path: 'not-found', component: NotFoundComponent },
  { path: "**", redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
