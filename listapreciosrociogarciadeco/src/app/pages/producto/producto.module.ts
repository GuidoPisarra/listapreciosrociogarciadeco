import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductoPageRoutingModule } from './producto-routing.module';
import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";

import { ProductoPage } from './producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductoPageRoutingModule,
    NgxQRCodeModule,
    ComponentsModule

  ],
  declarations: [ProductoPage]
})
export class ProductoPageModule {}
