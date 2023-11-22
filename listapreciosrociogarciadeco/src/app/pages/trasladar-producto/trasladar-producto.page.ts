import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonSelectOption } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProductModel } from 'src/app/models/productModel';
import { RestService } from 'src/app/service/rest.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-trasladar-producto',
  templateUrl: './trasladar-producto.page.html',
  styleUrls: ['./trasladar-producto.page.scss'],
})
export class TrasladarProductoPage implements OnInit {
  protected cargando = false;
  protected productsTraslado: Array<ProductModel> = [];
  protected resultsTraslado: Array<ProductModel> = [];
  protected sucursales: Array<any> = [];
  protected sucursalParaEnviar: any;
  protected indiceAMostrar = 0;
  protected negocio: string = this.storage.getNegocio();
  protected errorSinSucursal: boolean = false;
  protected trasladoCorrecto: boolean = false;
  protected errorSeleccionSucursal: boolean = false;
  protected errorMismoNegocio: boolean = false;
  protected sucursalActual: number = 0;

  constructor(
    public router: Router,
    public rest: RestService,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.productsTraslado = [];
    this.resultsTraslado = [];
    this.cargando = true;
    this.trasladoCorrecto = false;
    this.errorSeleccionSucursal = false;
    this.errorMismoNegocio = false;
    this.cargarProductos();
    const sucursal: Observable<any> = this.rest.obtenerNegocios(this.negocio);
    sucursal.subscribe(response => {
      this.sucursales = response['datos']['negocios'];
      //this.sucursales = this.sucursales.filter(d => d.sucursal !== this.sucursalActual);
      this.cargando = false;
      if (this.sucursales.length === 0) {
        this.errorSinSucursal = true;
      }
    });

  }

  protected cargarProductos() {
    this.productsTraslado = [];
    this.resultsTraslado = [];
    this.storage.getProductsTraslado().forEach(item => {
      const productCopy = this.nuevoProduct(item);
      this.resultsTraslado.push(item);
      this.productsTraslado.push(productCopy);
    });
    this.sucursalActual = this.resultsTraslado[0].sucursal;
  }



  protected aumentarValor(id: number) {
    const input = document.querySelector('#cant' + id);
    let cant = parseInt((input as HTMLInputElement).value);
    const item: any = this.buscarItem(id);
    if (cant < item.quantity) {
      cant++;
    }
    (input as HTMLInputElement).value = cant.toString();
    this.actualizarValor(id, cant);
  }

  protected disminuirValor(id: number) {
    const input = document.querySelector('#cant' + id);
    let cant = parseInt((input as HTMLInputElement).value);
    if (cant > 0) {
      cant--;
    }
    (input as HTMLInputElement).value = cant.toString();
    this.actualizarValor(id, cant);
  }

  buscarItem(id: number) {
    let prod;
    this.productsTraslado.forEach(item => {
      if (item.id === id) {
        prod = item;
      }
    });
    return prod;
  }

  actualizarValor(id: number, cant: number) {
    this.resultsTraslado.forEach(item => {
      if (item.id === id) {
        item.quantity = cant;
      }
    });
  }

  nuevoProduct(item: any): ProductModel {
    return new ProductModel(item.code, item.id, item.description, item.costPrice, item.size, item.quantity, item.salePrice, item.Proveedor, item.id_negocio, item.sucursal, item.nombre_sucursal);
  }

  sucursalSeleccionada(ev: any) {
    this.sucursales.forEach(suc => {
      if (suc.id === ev.target.value) {
        this.sucursalParaEnviar = suc;
      }
    })
  }

  enviar() {
    const sucursalSeleccionada = document.querySelector("#selectEnviar");
    this.errorSeleccionSucursal = false;
    this.errorMismoNegocio = false;

    const mismoNegocio = this.resultsTraslado[0].sucursal === parseInt((sucursalSeleccionada as HTMLSelectElement).value);
    console.log(mismoNegocio);
    if (!mismoNegocio && (sucursalSeleccionada as HTMLSelectElement).value !== undefined) {
      this.cargando = true;
      this.resultsTraslado.forEach(item => {
        if (item.quantity !== 0) {
          this.resultsTraslado = this.resultsTraslado.filter(item => item.quantity !== 0);
          item.sucursal_nueva = (sucursalSeleccionada as HTMLSelectElement).value;
        }
      });
      const sucursal: Observable<any> = this.rest.sendTraslado(this.resultsTraslado);
      sucursal.subscribe(r => {

        this.cargando = false;
        this.trasladoCorrecto = true;
        setTimeout(() => {
          this.router.navigate(['index']);
        }, 3000);
      })
    } else {
      if (mismoNegocio) {
        this.errorMismoNegocio = true;
      } else {
        this.errorSeleccionSucursal = true;
      }
    }
  }
}


