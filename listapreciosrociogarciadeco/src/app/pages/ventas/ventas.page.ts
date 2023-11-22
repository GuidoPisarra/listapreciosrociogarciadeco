import { RestService } from './../../service/rest.service';
import { Component } from '@angular/core';
import { Observable, identity } from 'rxjs';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage {
  protected ventas: Array<any> = [];
  protected cambios: Array<any> = [];
  protected ventasReport: Array<any> = [];
  protected totales: Array<number> = [];
  protected cargando: boolean = true;
  protected listadoTotal: Array<any> = [];


  constructor(
    private rest: RestService,
    private storage: StorageService
  ) { }

  ionViewDidEnter() {
    this.cargando = true;
    this.ventas = [];
    const report: Observable<any> = this.rest.salesReport();
    report.subscribe(response => {

      this.ventas = response['datos']['ventas'];
      this.cambios = response['datos']['cambios'];
      const arregloCombinado = [...this.ventas, ...this.cambios];
      this.ventas.forEach(item => {
        let total = 0;
        item.forEach((element: { amount: number; }) => {
          total += element.amount;
        });
        item['total'] = total;
        item['fecha'] = item[0].sale_product_date;
      });

      this.listadoTotal = arregloCombinado.sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha_cambio);
        return dateA.getTime() - dateB.getTime();
      }).reverse();
      this.cargando = false;

    });
  }

  private formatDate(dateString: string): string {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hour = date.getHours().toString().padStart(2, '0');
    let minute = date.getMinutes().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hour}:${minute}`;
  }






}
