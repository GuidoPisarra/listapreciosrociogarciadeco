import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigosQRPage } from './codigos-qr.page';

const routes: Routes = [
  {
    path: '',
    component: CodigosQRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodigosQRPageRoutingModule {}
