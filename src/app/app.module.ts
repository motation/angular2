import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { Navigation}  from './navigation/navigation.component'

import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent }
]


@NgModule({
  imports:      [ BrowserModule, RouterModule.forRoot(appRoutes) ],
  declarations: [ AppComponent, Navigation, HomeComponent ],
  bootstrap:    [ AppComponent, Navigation ]
})
export class AppModule { }
