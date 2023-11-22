import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyStockPageRoutingModule } from './modify-stock-routing.module';

import { ModifyStockPage } from './modify-stock.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyStockPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ModifyStockPage]
})
export class ModifyStockPageModule {}
