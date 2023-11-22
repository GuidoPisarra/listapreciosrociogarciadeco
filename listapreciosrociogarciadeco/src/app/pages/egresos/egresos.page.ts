import { RestService } from './../../service/rest.service';
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ExpenseModel } from './../../models/expenseModel';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.page.html',
  styleUrls: ['./egresos.page.scss'],
})
export class EgresosPage {
  protected listaEgresos: Array<ExpenseModel> = [];
  protected listaEgresosVista: Array<ExpenseModel> = [];
  protected pagina: number = 1;
  descripcionEgreso: string = '';
  montoEgreso: number = 0;
  egresoCorrecto: boolean = false;
  constructor(
    private rest: RestService,
    private storage: StorageService
  ) { }

  ionViewDidEnter() {
    this.egresoCorrecto = false;
    this.descripcionEgreso = '';
    this.montoEgreso = 0;
    this.listaEgresos = [];
    this.listaEgresosVista = [];
    this.pagina = 1;
    const expenses: Observable<any> = this.rest.getExpenses();
    expenses.subscribe(response => {
      response['datos'].forEach((expense: ExpenseModel) => {
        console.log(expense);
        this.listaEgresos.push(expense);
      });
      this.generateItems();
    })
  }

  public saveExpense(): void {
    let errDescripcion = document.querySelector('#errorDescripcion') as HTMLElement;
    let errMonto = document.getElementById('errorMonto') as HTMLElement;
    errDescripcion.hidden = true;
    errMonto.hidden = true;

    if (this.descripcionEgreso === '' || this.montoEgreso === 0) {
      if (this.descripcionEgreso === '') {
        errDescripcion.hidden = false;
      }
      if (this.montoEgreso === 0) {
        errMonto.hidden = false;
      }
    } else {
      const payload = {
        'description': this.descripcionEgreso,
        'price': this.montoEgreso,
        "id_negocio": this.storage.getNegocio()
      };
      this.rest.saveExpense(payload);
      this.egresoCorrecto = true;
      setTimeout(() => {
        this.ionViewDidEnter();
      }, 2000);

    }

  }
  private generateItems() {
    const count = this.listaEgresos.length;
    for (let i = 0; i < 6 * this.pagina; i++) {

      if ((this.listaEgresos[i] !== undefined) && (this.listaEgresos[i] !== this.listaEgresosVista[i])) {
        this.listaEgresosVista.push(this.listaEgresos[i]);
      }
    }
    this.pagina++;
  }

  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
