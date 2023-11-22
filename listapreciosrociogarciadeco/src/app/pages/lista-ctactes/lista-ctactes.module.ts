import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaCtactesPageRoutingModule } from './lista-ctactes-routing.module';

import { ListaCtactesPage } from './lista-ctactes.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaCtactesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ListaCtactesPage]
})
export class ListaCtactesPageModule { }
