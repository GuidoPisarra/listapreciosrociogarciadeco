import { RestService } from './../../service/rest.service';
import { ProductModel } from './../../models/productModel';
import { LocalRestService } from './../../service/local-rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modify-stock',
  templateUrl: './modify-stock.page.html',
  styleUrls: ['./modify-stock.page.scss'],
})
export class ModifyStockPage implements OnInit {
  listOfProducts: Array<ProductModel> = [];
  nombre!: string;
  precio!: number;
  precioCosto!: number;
  cantidad: number = 0;
  talle!: string;
  productModify!: ProductModel;
  protected stockCorrecto: boolean = false;
  protected error: boolean = false;
  protected agregar: number = 0;

  constructor(
    private rutaActiva: ActivatedRoute,
    private localRest: LocalRestService,
    private rest: RestService,
    private route: Router
  ) { }

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.stockCorrecto = false;
    const prodcts: Observable<any> = this.rest.getProducts();
    let id = parseInt(this.rutaActiva.snapshot.params['id']);
    prodcts.subscribe(response => {
      response['datos'].forEach((item: any) => {
        this.listOfProducts.push(item);
        if (item.id === id) {
          this.nombre = item.description;
          this.talle = item.size;
          this.precio = item.sale_price;
          this.precioCosto = item.sale_price;
          this.cantidad = item.quantity;
          this.productModify = item;
        }
      });
      if (this.nombre === undefined) {
        this.error = true;
      }
    })
  }

  saveStock() {
    this.productModify.quantity = this.agregar;
    let payload = {
      'id': this.productModify.id,
      "description": this.productModify.description,
      "costPrice": this.precioCosto,
      "salePrice": this.precio,
      "size": this.productModify.size,
      "quantity": this.agregar,
      "code": this.productModify.code,
      "idProveedor": 1
    }
    this.listOfProducts.forEach(item => {
      if (item.id === this.productModify.id) {
        this.nombre = item.description;
        this.talle = item.size;
        this.precio = item.salePrice;
        this.cantidad = item.quantity + this.agregar;
        this.productModify = item;
      }
    });
    this.stockCorrecto = true;
    setTimeout(() => {
      this.route.navigate(['stock']);
    }, 3000);
    console.log(payload);
    const a = this.rest.addStock(payload).subscribe(response => {
      console.log(response);
    });

  }

  protected volver(ev: any): void {
    ev.preventDefault();
    this.route.navigate(['stock']);
  }


}
