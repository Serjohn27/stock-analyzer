import { FundamentalSearchComponent } from './search/fundamental-search/fundamental-search.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechnicalSearchComponent } from './search/technical-search/technical-search.component';


const routes: Routes = [
  { path: '', redirectTo: '/technical-search', pathMatch: 'full' },
  { path: 'technical-search', component: TechnicalSearchComponent },
  { path: 'fundamental-search', component: FundamentalSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
