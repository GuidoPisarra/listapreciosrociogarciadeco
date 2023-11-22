import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from 'src/app/service/rest.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.page.html',
  styleUrls: ['./sucursal.page.scss'],
})
export class SucursalPage implements OnInit {
  protected negocio: string = this.storage.getNegocio();
  protected listaNegocios: Array<any> = [];
  protected cargando: boolean = true;
  protected verNueva: boolean = false;
  protected errorNombre: boolean = false;
  protected errorDomicilio: boolean = false;
  protected errorDomicilioIgual: boolean = false;

  protected nombre: string = '';
  protected domicilio: string = '';
  protected telefono: string = '';

  constructor(
    private rest: RestService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.buscarNegocios();
  }

  protected buscarNegocios() {
    this.listaNegocios = [];
    this.cargando = true;
    const listado: Observable<any> = this.rest.obtenerNegocios(this.negocio);
    listado.subscribe(response => {
      this.listaNegocios = response['datos']['negocios'];
      this.cargando = false;
    });

  }

  protected eliminarNegocio(sucursal: number) {
    this.cargando = true;

    const payload = {
      "id_negocio": this.storage.getNegocio(),
      "sucursal": sucursal
    };

    const respuesta: Observable<any> = this.rest.eliminarNegocio(payload);
    respuesta.subscribe(response => {
      console.log(response);
      if (response['datos']['OK']) {
        this.cancelarNueva();
        this.buscarNegocios();
      }
      this.cargando = false;
    });
  }

  protected nuevaSucursal() {
    this.verNueva = true;
  }

  protected cancelarNueva() {
    this.verNueva = false;
    this.nombre = '';
    this.domicilio = '';
    this.telefono = '';
    this.errorNombre = false;
    this.errorDomicilio = false;
    this.errorDomicilioIgual = false;
  }

  protected guardarNueva() {
    this.errorNombre = false;
    this.errorDomicilio = false;
    this.errorDomicilioIgual = false;
    if (this.nombre === '') {
      this.errorNombre = true;
    }
    if (this.domicilio === '') {
      this.errorDomicilio = true;
    }
    if (!this.errorNombre && !this.errorDomicilio) {
      let idNuevo = 0;
      this.listaNegocios.forEach(item => {
        if (item.sucursal > idNuevo) {
          idNuevo = item.sucursal;
        }
        if (this.domicilio === item.domicilio) {
          this.errorDomicilioIgual = true;
        }
      });

      if (!this.errorDomicilioIgual) {
        idNuevo++;
        this.cargando = true;

        const payload = {
          "id_negocio": this.storage.getNegocio(),
          "sucursal": idNuevo,
          "nombre": this.nombre,
          "domicilio": this.domicilio,
          "telefono": this.telefono
        };

        const respuesta: Observable<any> = this.rest.nuevoNegocio(payload);
        respuesta.subscribe(response => {
          console.log(response);
          if (response['datos']['OK']) {
            this.cancelarNueva();
            this.buscarNegocios();
          }
          this.cargando = false;
        });
      }
    }



  }
}
