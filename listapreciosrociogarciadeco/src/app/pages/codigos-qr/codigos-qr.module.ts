import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigosQRPageRoutingModule } from './codigos-qr-routing.module';

import { CodigosQRPage } from './codigos-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigosQRPageRoutingModule,
    ComponentsModule,
    NgxQRCodeModule

  ],
  declarations: [CodigosQRPage]
})
export class CodigosQRPageModule {}
