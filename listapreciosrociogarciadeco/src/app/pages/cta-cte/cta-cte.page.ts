import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RestService } from 'src/app/service/rest.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cta-cte',
  templateUrl: './cta-cte.page.html',
  styleUrls: ['./cta-cte.page.scss'],
})
export class CtaCtePage {
  protected cargando: boolean = true;
  protected ventaCorrecta: boolean = false;
  protected carrito: Array<any> = [];
  protected clientes: Array<any> = [];
  protected clientesResult: Array<any> = [];
  protected indiceAMostrar = 0;
  protected cantidadInicialAMostrar = 2;
  protected clienteSeleccionado: any = '';
  protected totalVenta: number = 0;
  protected negocio: number = parseInt(this.storage.getNegocio());
  protected sucursal: number = parseInt(this.storage.getSucursal());
  protected clienteNuevo: boolean = false;

  protected apellido: string = '';
  protected nombre: string = '';
  protected dni: string = '';
  protected telefono: string = '';
  protected errorCamposCliente: boolean = false;
  protected errorClienteExistente: boolean = false;

  constructor(
    private storage: StorageService,
    private rest: RestService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ionViewDidEnter() {
    this.errorCamposCliente = false;
    this.errorClienteExistente = false;
    this.cargando = true;
    this.carrito = this.storage.getVentasCtaCte();
    this.clienteSeleccionado = '';
    this.negocio = parseInt(this.storage.getNegocio());
    this.sucursal = parseInt(this.storage.getSucursal());
    const clientes: Observable<any> = this.rest.getClientes();
    clientes.subscribe(response => {
      this.clientes = response['datos'];
      this.clientesResult = response['datos'];
      this.cargando = false;
    });
  }

  protected agregarCliente() {
    this.clienteNuevo = true;
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

  handleChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.clientesResult = this.clientes.filter(item => item.apellido.toLowerCase().includes(query));
  }

  protected verCliente(id: number) {
    const cliente = this.clientes.filter(item => item.id === id);
    this.totalVenta = 0;
    this.clienteSeleccionado = cliente[0];
    this.carrito.forEach(item => {
      const producto = this.storage.getOneProductById(item.idProduct);
      if (producto !== null && producto !== undefined) {
        item['description'] = producto.getDescription();
        const subtotal = producto.getSalePrice() * item.quantity;
        item['subtotal'] = subtotal;
        item['negocio'] = this.negocio;
        item['sucursal'] = this.sucursal;
        item['typePayment'] = 'Cta Cte';
        this.totalVenta += subtotal;
      }
    });
    console.log(this.carrito);
  }

  protected vender() {
    const payload = {
      'cliente': this.clienteSeleccionado,
      'venta': this.carrito
    }
    this.cargando = true;
    const venta: Observable<any> = this.rest.venderCtaCte(payload);
    venta.subscribe(respuesta => {
      console.log(respuesta);
      this.cargando = false;
      if (respuesta['datos']['OK'] === 'OK') {
        this.ventaCorrecta = true;
        setTimeout(() => {
          this.router.navigate(['index']);
        }, 3000);
      }
    });

  }

  protected guardarCliente() {
    this.errorCamposCliente = false;
    this.cargando = true;
    this.errorClienteExistente = false;
    if (this.apellido !== '' && this.nombre !== '' && this.dni !== '') {
      let clienteExistente = false;
      this.clientes.forEach(cli => {
        if (cli.dni == this.dni) {
          clienteExistente = true;
        }
      });
      if (!clienteExistente) {
        const payload = {
          'apellido': this.apellido,
          'nombre': this.nombre,
          'dni': this.dni,
          'telefono': this.telefono,
          'id_negocio': this.negocio
        };
        const guardarCliente: Observable<any> = this.rest.saveCliente(payload);
        guardarCliente.subscribe(response => {
          this.clientes = response['datos'];
          this.clientesResult = response['datos'];
          this.cancelarGuardar();
          this.ionViewDidEnter();
        });
      } else {
        this.errorClienteExistente = true;
      }
    } else {
      this.errorCamposCliente = true;
    }
  }

  protected cancelarGuardar() {
    this.clienteNuevo = false;
    this.apellido = '';
    this.nombre = '';
    this.dni = '';
    this.telefono = '';
    this.errorCamposCliente = false;
    this.errorClienteExistente = false;

  }
}
