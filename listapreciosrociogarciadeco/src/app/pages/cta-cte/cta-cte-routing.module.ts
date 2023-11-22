import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CtaCtePage } from './cta-cte.page';

const routes: Routes = [
  {
    path: '',
    component: CtaCtePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CtaCtePageRoutingModule {}
