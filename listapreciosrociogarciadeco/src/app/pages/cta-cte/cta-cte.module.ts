import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CtaCtePageRoutingModule } from './cta-cte-routing.module';

import { CtaCtePage } from './cta-cte.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CtaCtePageRoutingModule,
    ComponentsModule
  ],
  declarations: [CtaCtePage]
})
export class CtaCtePageModule { }
