import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {AuthguardService} from './authguards/authguard.service';
import {HttpClientModule} from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    AuthguardService,
    { provide: JWT_OPTIONS, useValue: {} },  // Provide JWT_OPTIONS
    JwtHelperService,  // Provide JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
