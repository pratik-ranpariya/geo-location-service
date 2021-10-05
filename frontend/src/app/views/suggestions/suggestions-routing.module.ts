import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuggestionsComponent } from './suggestions.component';

const routes: Routes = [
  {
    path: '',
    component: SuggestionsComponent,
    data: {
      title: 'suggestions'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuggestionsRoutingModule {}