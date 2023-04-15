import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpUrlEncodingCodec,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { UrlDecoderPipe } from './pipes';
import { TreeViewComponent } from './tree-view/tree-view.component';

const COMPONENTS = [TreeViewComponent, DetailViewComponent];

@NgModule({
  declarations: [AppComponent, UrlDecoderPipe],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    BrowserAnimationsModule,
    ...COMPONENTS, //Using stand-alone components
  ],
  providers: [HttpUrlEncodingCodec],
  bootstrap: [AppComponent],
})
export class AppModule {}
