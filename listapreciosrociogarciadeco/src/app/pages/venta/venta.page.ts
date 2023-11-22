import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductModel } from 'src/app/models/productModel';
import { RestService } from 'src/app/service/rest.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.page.html',
  styleUrls: ['./venta.page.scss'],
})
export class VentaPage {
  protected cargando: boolean = true;
  protected ventaCorrecta: boolean = false;
  protected carrito: Array<any> = [];
  protected carritoVenta: Array<ProductModel> = [];
  protected totalVenta: number = 0;
  protected recargo: number = 0;
  protected descuento: number = 0;
  protected negocio: string = this.storage.getNegocio();
  protected sucursal: string = this.storage.getSucursal();
  constructor(
    private storage: StorageService,
    private rest: RestService,
    private router: Router
  ) { }

  ionViewDidEnter() {
    this.carrito = [];
    this.carritoVenta = [];
    this.totalVenta = 0;
    this.carrito = this.storage.getVentasCtaCte();
    this.carrito.forEach(item => {
      const producto = this.storage.getOneProductById(item.idProduct);
      if (producto !== null && producto !== undefined) {
        const nuevo = new ProductModel(
          producto.getCode(),
          producto.getIdProduct(),
          producto.getDescription(),
          producto.getCostPrice(),
          producto.getSize(),
          item.quantity,
          producto.getSalePrice(),
          producto.getIdProveedor(),
          parseInt(this.negocio),
          parseInt(this.sucursal),
          producto.getNombreSucursal()
        );
        nuevo.setTypePayment(this.storage.getFormaPago());
        nuevo.setUsuario(this.storage.getPersona().toString());
        this.carritoVenta.push(nuevo);
        item['description'] = producto.getDescription();
        const subtotal = producto.getSalePrice() * item.quantity;
        item['subtotal'] = subtotal;
        item['negocio'] = this.negocio;
        item['sucursal'] = this.sucursal;
        item['typePayment'] = 'Cta Cte';
        item['code'] = producto.getCode();
        this.totalVenta += subtotal;
      }
    });
    this.cargando = false;
  }

  aplicarRecargo() {
    this.carritoVenta = [];
    this.totalVenta = 0;
    this.carrito.forEach(item => {
      const producto = this.storage.getOneProductById(item.idProduct);
      let precioFinal = 0;
      if (producto !== null && producto !== undefined) {
        precioFinal = producto.getSalePrice() + ((producto.getSalePrice() * this.recargo) / 100);
        const nuevo = new ProductModel(
          producto.getCode(),
          producto.getIdProduct(),
          producto.getDescription(),
          producto.getCostPrice(),
          producto.getSize(),
          item.quantity,
          precioFinal,
          producto.getIdProveedor(),
          parseInt(this.negocio),
          parseInt(this.sucursal),
          producto.getNombreSucursal()
        );
        nuevo.setTypePayment(this.storage.getFormaPago());
        nuevo.setUsuario(this.storage.getPersona().toString());
        this.carritoVenta.push(nuevo);
        item['description'] = producto.getDescription();
        const subtotal = precioFinal * item.quantity;
        item['subtotal'] = subtotal;
        item['negocio'] = this.negocio;
        item['sucursal'] = this.sucursal;
        item['typePayment'] = 'Cta Cte';
        item['code'] = producto.getCode();
        this.totalVenta += subtotal;
      }
    });
  }

  aplicarDescuento() {
    this.carritoVenta = [];
    this.totalVenta = 0;
    this.carrito.forEach(item => {
      const producto = this.storage.getOneProductById(item.idProduct);
      let precioFinal = 0;
      if (producto !== null && producto !== undefined) {
        precioFinal = producto.getSalePrice() - ((producto.getSalePrice() * this.descuento) / 100);

        const nuevo = new ProductModel(
          producto.getCode(),
          producto.getIdProduct(),
          producto.getDescription(),
          producto.getCostPrice(),
          producto.getSize(),
          item.quantity,
          precioFinal,
          producto.getIdProveedor(),
          parseInt(this.negocio),
          parseInt(this.sucursal),
          producto.getNombreSucursal()
        );
        nuevo.setTypePayment(this.storage.getFormaPago());
        nuevo.setUsuario(this.storage.getPersona().toString());
        this.carritoVenta.push(nuevo);
        item['description'] = producto.getDescription();
        const subtotal = precioFinal * item.quantity;
        item['subtotal'] = subtotal;
        item['negocio'] = this.negocio;
        item['sucursal'] = this.sucursal;
        item['typePayment'] = 'Cta Cte';
        item['code'] = producto.getCode();
        this.totalVenta += subtotal;
      }
    });
  }
  vender() {
    const vendido: Observable<any> = this.rest.saveSales(this.carritoVenta);
    this.cargando = true;
    vendido.subscribe((res) => {
      console.log(res['datos'][0]);
      if (res['datos'][0] === true) {
        this.ventaCorrecta = true;
        setTimeout(() => {
          this.router.navigate(['index']);
        }, 3000);
      }
      this.cargando = false;
    });
  }
}
