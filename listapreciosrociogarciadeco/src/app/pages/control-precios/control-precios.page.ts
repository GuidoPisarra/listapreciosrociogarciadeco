import { RestService } from './../../service/rest.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-control-precios',
  templateUrl: './control-precios.page.html',
  styleUrls: ['./control-precios.page.scss'],
})
export class ControlPreciosPage {
  porcentaje: number = 0;
  edicionCorrecta: boolean = false;
  cargando: boolean = false;
  errorSinProveedor: boolean = false;
  proveedores: Array<any> = [];
  proveedorSeleccionado: number = 0;
  constructor(
    private rest: RestService,
    private route: Router,
    private alertController: AlertController
  ) { }

  ionViewDidEnter() {
    this.cargando = true;
    const result: Observable<any> = this.rest.getProveedores();
    result.subscribe(response => {
      response['datos'].forEach((element: any) => {
        if (element.nombre !== 'Otro') {
          this.proveedores.push(element);
        }

      });

      this.cargando = false;
    }, err => {
      console.log(err);
      this.cargando = false;
    });
  }

  async savePorcentaje() {
    // this.edicionCorrecta = true;
    console.log(this.proveedorSeleccionado);

    if (this.proveedorSeleccionado === 0) {

      const alert = await this.alertController.create({
        header: 'Ud. no seleccionó ningún proveedor',
        message: `¿ Desea continuar ?`,

        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Continuar',
            role: 'confirm',
            handler: () => {
              console.log('cambiarTodosLosPrecios');
              const a = this.rest.increasePriceWithPercentaje(this.porcentaje, this.proveedorSeleccionado);
              setTimeout(() => {
                this.edicionCorrecta = false;
                this.route.navigate(['index']);
              }, 2000);
            },
          },
        ],
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
    } else {
      const a = this.rest.increasePriceWithPercentaje(this.porcentaje, this.proveedorSeleccionado);
      setTimeout(() => {
        this.edicionCorrecta = false;
        this.route.navigate(['index']);
      }, 2000);
    }



  }
  seleccionarProveedor(e: any) {
    this.proveedores.forEach(prov => {
      if (prov.id === e.target.value) {
        this.proveedorSeleccionado = prov.id;
      }
    })
  }
}
