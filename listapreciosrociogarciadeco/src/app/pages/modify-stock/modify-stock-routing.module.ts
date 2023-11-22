import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyStockPage } from './modify-stock.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyStockPageRoutingModule {}
