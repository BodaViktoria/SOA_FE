import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import {MainComponent} from './main/main.component';
import {AuthguardService} from './authguards/authguard.service';
import {AuthguardLoginService} from './authguards/authguard-login.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './LandingModule',
        type: 'module',
      })
        .then((m) => m.LandingModule)
        .catch((err) => {
          console.error('Error loading LandingModule:', err);
        }),
    canActivate: [AuthguardLoginService],
  },
  {
    path: 'main',  // Use a different path for the main layout
    component: MainComponent,  // Main layout as the parent component
    children: [
      {
        path: 'customer',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:4202/remoteEntry.js',
            exposedModule: './CustomerModule',
          })
            .then((m) => m.CustomerModule)
            .catch((err: any) => {
              console.error('Error loading remote module:', err);
            }),
      }
    ],
    canActivate: [AuthguardService]
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
