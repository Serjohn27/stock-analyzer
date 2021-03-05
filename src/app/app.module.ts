import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { QuoteSearchComponent } from './search/quote-search/quote-search.component';
import { TechnicalSearchComponent } from './search/technical-search/technical-search.component';

import { ShortNumberPipe } from '../app/common/pipes/short-number.pipe';

import { NgxSpinnerModule } from 'ngx-spinner';
import { CustomHttpInterceptor } from './common/interceptor/custom-http-interceptor/custom-http-interceptor';
import { FundamentalSearchComponent } from './search/fundamental-search/fundamental-search.component';



@NgModule({
  declarations: [
    ShortNumberPipe,
    AppComponent,
    NavigationBarComponent,
    QuoteSearchComponent,
    TechnicalSearchComponent,
    FundamentalSearchComponent
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
    ScrollingModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [
    ShortNumberPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
