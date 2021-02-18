import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { QuoteSearchComponent } from './search/quote-search/quote-search.component';
import { TechnicalSearchComponent } from './search/technical-search/technical-search.component';

import { ShortNumberPipe } from '../app/common/pipes/short-number.pipe';


@NgModule({
  declarations: [
    ShortNumberPipe,
    AppComponent,
    NavigationBarComponent,
    QuoteSearchComponent,
    TechnicalSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    FlexLayoutModule,
    LayoutModule,
    HttpClientModule,
    ScrollingModule
  ],
  providers: [ShortNumberPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
