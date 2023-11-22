import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlPreciosPageRoutingModule } from './control-precios-routing.module';

import { ControlPreciosPage } from './control-precios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlPreciosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ControlPreciosPage]
})
export class ControlPreciosPageModule {}
