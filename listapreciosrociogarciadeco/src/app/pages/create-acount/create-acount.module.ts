import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAcountPageRoutingModule } from './create-acount-routing.module';

import { CreateAcountPage } from './create-acount.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateAcountPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CreateAcountPage]
})
export class CreateAcountPageModule { }
