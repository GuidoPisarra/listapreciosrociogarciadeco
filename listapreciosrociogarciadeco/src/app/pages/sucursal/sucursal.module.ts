import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SucursalPageRoutingModule } from './sucursal-routing.module';

import { SucursalPage } from './sucursal.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SucursalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SucursalPage]
})
export class SucursalPageModule {}
