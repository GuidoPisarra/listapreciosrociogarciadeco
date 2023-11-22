import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrasladarProductoPageRoutingModule } from './trasladar-producto-routing.module';

import { TrasladarProductoPage } from './trasladar-producto.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrasladarProductoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TrasladarProductoPage]
})
export class TrasladarProductoPageModule { }
