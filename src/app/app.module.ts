import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { Navigation}  from './navigation/navigation.component'

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, Navigation ],
  bootstrap:    [ AppComponent, Navigation ]
})
export class AppModule { }
