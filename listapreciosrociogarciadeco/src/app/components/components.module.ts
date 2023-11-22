import { FooterComponent } from './footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { BotonIconoComponent } from './boton-icono/boton-icono.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BotonIconoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    BotonIconoComponent
  ]
})

export class ComponentsModule { }
