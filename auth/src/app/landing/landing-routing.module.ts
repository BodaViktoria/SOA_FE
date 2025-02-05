import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPanelComponent} from './login-panel/login-panel.component';

const routes: Routes = [
  { path: '', component: LoginPanelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
