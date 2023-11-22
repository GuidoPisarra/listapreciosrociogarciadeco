import { RestService } from './../../service/rest.service';
import { ProductModel } from './../../models/productModel';
import { LocalRestService } from 'src/app/service/local-rest.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage {
  listOfProducts: Array<any> = [];
  nombre!: string;
  precioCosto!: number;
  precioVenta!: number;
  cantidad!: number;
  talle!: string;
  id!: number;
  prodToEdit!: ProductModel;
  editarCorrecto: boolean = false;
  ubicacion!: string;

  constructor(
    private rutaActiva: ActivatedRoute,
    private localRest: StorageService,
    private rest: RestService,
    private route: Router,
    private storage: StorageService
  ) { }

  ionViewDidEnter() {
    this.listOfProducts = this.storage.getProducts();
    let id = parseInt(this.rutaActiva.snapshot.params['id']);
    this.id = id;
    this.listOfProducts.forEach(item => {
      if (item.id === id) {
        console.log(item);
        console.log(item);
        this.nombre = item.description;
        this.cantidad = item.quantity;
        this.talle = item.size;
        this.precioCosto = item.costPrice;
        this.precioVenta = item.salePrice;
        this.ubicacion = item.nombreSucursal;
        if (item.sucursal === 0) {
          this.ubicacion += '(Casa central)';
        }
      }
    })
  }

  saveProduct() {
    this.listOfProducts.forEach(prod => {
      if (this.id === prod.id) {
        this.prodToEdit = prod;
      }
    });
    this.prodToEdit.salePrice = this.precioVenta;
    this.prodToEdit.description = this.nombre;
    this.prodToEdit.costPrice = this.precioCosto;
    console.log(this.prodToEdit);
    this.rest.editOneProduct(this.prodToEdit);

    this.editarCorrecto = true;
    setTimeout(() => {
      this.route.navigate(['lista-productos']);
      this.editarCorrecto = false;
    }, 2000);
  }

}
