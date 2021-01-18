import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechnicalSearchComponent } from './search/technical-search/technical-search.component';


const routes: Routes = [
  { path: 'technical-search', component: TechnicalSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
