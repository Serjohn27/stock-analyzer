import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { QuoteSearchComponent } from './search/quote-search/quote-search.component';
import { TechnicalSearchComponent } from './search/technical-search/technical-search.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    QuoteSearchComponent,
    TechnicalSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
