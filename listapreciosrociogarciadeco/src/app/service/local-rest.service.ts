import { ProductModel } from './../models/productModel';
import { Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalRestService {
  product!: ProductModel;
  listOfProducts: Array<ProductModel> = [];

  constructor() { }

  sendProduct(prod: ProductModel) {
    this.product = prod;
  }

  getProduct() {
    return this.product;
  }

  postListOfProducts(list: Array<ProductModel>) {
    this.listOfProducts = list;
  }

  getListOfProducts() {
    return this.listOfProducts;
  }
}
