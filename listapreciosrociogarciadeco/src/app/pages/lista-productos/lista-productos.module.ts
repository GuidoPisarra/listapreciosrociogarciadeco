import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaProductosPageRoutingModule } from './lista-productos-routing.module';
import { ComponentsModule } from './../../components/components.module';

import { ListaProductosPage } from './lista-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaProductosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ListaProductosPage]
})
export class ListaProductosPageModule {  }
