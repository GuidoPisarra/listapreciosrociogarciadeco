import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrasladarProductoPage } from './trasladar-producto.page';

const routes: Routes = [
  {
    path: '',
    component: TrasladarProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrasladarProductoPageRoutingModule {}
