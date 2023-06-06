import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "error/:errorCode", component: ErrorComponent },
  { path: "user", loadChildren: () => import("./user/user.module").then(module => module.UserModule) },
  { path: "amazon", loadChildren: () => import("./amazon/amazon.module").then(module => module.AmazonModule) },
  { path: "meesho", loadChildren: () => import("./meesho/meesho.module").then(module => module.MeeshoModule) },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
