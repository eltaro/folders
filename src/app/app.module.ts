import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { TreeViewComponent } from './tree-view/tree-view.component';

const COMPONENTS = [
  TreeViewComponent,
  DetailViewComponent
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    BrowserAnimationsModule,
    ...COMPONENTS //Using stand-alone components
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
