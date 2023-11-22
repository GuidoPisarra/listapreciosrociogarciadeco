import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from 'src/app/service/rest.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.page.html',
  styleUrls: ['./detalle-cuenta.page.scss'],
})
export class DetalleCuentaPage {
  protected cargando: boolean = true;
  protected errorMonto: boolean = false;
  protected movimientos: Array<any> = [];
  protected cliente: any = this.storage.getCliente()[0];
  protected deuda: number = 0;
  protected deudaActualizada: number = 0;
  protected entregas: number = 0;
  constructor(
    private storage: StorageService,
    private rest: RestService
  ) { }

  ionViewDidEnter() {
    this.cargando = true;
    this.errorMonto = false;
    this.entregas = 0;
    this.deuda = 0;
    this.deudaActualizada = 0;
    console.log(this.storage.getCliente()[0]);
    const clientes: Observable<any> = this.rest.getMovimientosCliente(this.cliente.id);
    clientes.subscribe(response => {
      this.movimientos = response['datos'];
      this.obtenerDeudaYEntregas();
      console.log(this.movimientos);
      this.cargando = false;
    });
  }

  protected obtenerDeudaYEntregas() {
    this.movimientos.forEach(item => {
      if (item.description === undefined) {
        this.entregas += item.entrega;
      } else {
        this.deuda += item.quantity * item.precio_original;
        this.deudaActualizada += item.quantity * item.precio_actual;
      }
    })
    this.deuda -= this.entregas;
    this.deudaActualizada -= this.entregas;
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  }

  registrarPago() {
    const monto = (document.querySelector('#montoPago') as HTMLInputElement).value;
    this.errorMonto = false;
    if (monto === '') {
      this.errorMonto = true;
    } else {
      console.log(monto);
      this.cargando = true;
      const payload = {
        'id_cta_cte': 0,
        'id_persona': this.cliente.idCliente,
        'entrega': monto
      }
      const pago: Observable<any> = this.rest.registrarPago(payload);
      pago.subscribe(response => {
        this.ionViewDidEnter();
      });

    }
  }

}
