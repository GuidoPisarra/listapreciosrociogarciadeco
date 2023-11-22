import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambioPageRoutingModule } from './cambio-routing.module';

import { CambioPage } from './cambio.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambioPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CambioPage]
})
export class CambioPageModule {  }
