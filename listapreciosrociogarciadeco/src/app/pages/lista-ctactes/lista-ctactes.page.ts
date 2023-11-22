import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RestService } from 'src/app/service/rest.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-lista-ctactes',
  templateUrl: './lista-ctactes.page.html',
  styleUrls: ['./lista-ctactes.page.scss'],
})
export class ListaCtactesPage {
  protected cargando: boolean = true;
  protected clienteSeleccionado: any = '';
  protected clientes: Array<any> = [];
  protected clientesResult: Array<any> = [];
  protected cantidadInicialAMostrar: number = 2;
  protected indiceAMostrar: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private rest: RestService,
    private storage: StorageService,
    private router: Router
  ) { }

  ionViewDidEnter() {
    this.cargando = true;
    this.clienteSeleccionado = '';
    const clientes: Observable<any> = this.rest.getClientesCtaCte();
    clientes.subscribe(response => {
      console.log(response['datos']);
      this.clientes = response['datos'];
      this.clientesResult = response['datos'];
      this.cargando = false;
    });
  }
  handleChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.clientesResult = this.clientes.filter(item => item.apellido.toLowerCase().includes(query));
  }

  verCliente(id: number) {
    const cliente = this.clientes.filter(item => item.id === id);
    this.clienteSeleccionado = cliente[0];
  }

  onIonInfinite(ev: any) {
    const startIndex = this.indiceAMostrar;
    const endIndex = startIndex + 20;
    const clientesInsertar = this.clientes.slice(startIndex, endIndex);

    clientesInsertar.forEach((element) => {
      this.clientes.push(element);
      this.clientesResult.push(element);
    });

    this.indiceAMostrar = endIndex;
    this.cantidadInicialAMostrar = this.indiceAMostrar + 20;
    setTimeout(() => {
      // Notificar a Angular para volver a renderizar la vista
      this.cdr.detectChanges();
      (ev as InfiniteScrollCustomEvent).target.complete();
      this.cargando = false;
    }, 500);
  }

  verDetalleCliente(id: number) {
    const cliente = this.clientes.filter(item => item.id === id);
    this.storage.guardarCliente(cliente);
    this.router.navigate(['detalle-cuenta']);
  }

}
