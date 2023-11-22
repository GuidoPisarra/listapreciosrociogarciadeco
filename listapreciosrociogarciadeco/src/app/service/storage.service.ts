import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from '../models/productModel';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { ProductSaleModel } from '../models/productSaleModel';


@Injectable({
  providedIn: 'root'
})

export class StorageService {

  protected listOfProducts: Array<ProductModel> = [];
  protected listOfProductsTraslado: Array<ProductModel> = [];
  protected carrito: Array<ProductSaleModel> = [];

  constructor(
    public http: HttpClient
  ) { }


  getProducts(): Array<ProductModel> {
    let productos = localStorage.getItem('listOfProducts');
    if (productos !== null) {
      this.listOfProducts = JSON.parse(productos);
    }
    return this.listOfProducts;
  }

  saveProducts(list: Observable<any>): void {
    this.listOfProducts = [];
    list.subscribe(response => {
      response['datos'].forEach((element: any) => {
        const prod: ProductModel = new ProductModel(element.code,
          element.id,
          element.description,
          element.cost_price,
          element.size,
          element.quantity,
          element.sale_price,
          element.id_proveedor,
          parseInt(this.getNegocio()),
          parseInt(element.sucursal),
          element.nombreSucursal
        );
        this.listOfProducts.push(prod);
      });
      localStorage.removeItem('listOfProducts');
      localStorage.setItem('listOfProducts', JSON.stringify(this.listOfProducts));
    })

  }

  public getlistOfProducts(): Array<ProductModel> {
    let list: Array<ProductModel> = [];
    const listLocalStorage: any = localStorage.getItem('listOfProducts');
    const listaJson = JSON.parse(listLocalStorage);
    if (listaJson !== null) {
      listaJson.forEach((element: any) => {
        const item = new ProductModel(element.code, parseInt(element.id), element.description, parseFloat(element.costPrice), element.size, parseInt(element.quantity), parseFloat(element.salePrice), parseInt(element.idProveedor), parseInt(this.getNegocio()), parseInt(element.sucursal), element.nombreSucursal);
        list.push(item);
      });
    }
    return list;
  }


  getOneProduct(code: any) {
    this.listOfProducts.forEach(item => {
      if (item.code === code) {
        console.log(item);
      }
    })
  }
  getOneProductById(id: number): ProductModel | null {
    let foundItem: ProductModel | null = null;
    const prod = this.getlistOfProducts();
    prod.forEach(element => {
      if (element.id === id) {
        foundItem = new ProductModel(element.code, element.id, element.description, element.costPrice, element.size, element.quantity, element.salePrice, element.idProveedor, parseInt(this.getNegocio()), element.sucursal, element.nombreSucursal);
      }
    });

    return foundItem;
  }

  saveSale(carrito: any) {
    carrito.forEach((element: any) => {
      this.listOfProducts.forEach(itemLista => {
        if (element.id === itemLista.id) {
          itemLista.quantity = itemLista.quantity - element.quantity;
        }
      });
    });
  }

  deleteProduct(id: number): void {
    const index = this.listOfProducts.findIndex(item => item.id === id);

    if (index !== -1) {
      this.listOfProducts.splice(index, 1);
    }
    localStorage.removeItem('listOfProducts');
    localStorage.setItem('listOfProducts', JSON.stringify(this.listOfProducts));
  }

  addProduct(payload: any): void {
    console.log(payload);
  }

  salesReport() {
  }

  increasePriceWithPercentaje(percentage: any) {
  }

  addStock(payload: any) {
  }

  editOneProduct(payload: ProductModel) {
  }

  saveExpense(payload: any) {
  }

  getExpenses() {
  }

  getBalance(month: number, year: number) {
  }

  saveSales(payload: any) {
  }

  backupProducts() {
  }

  listOfProductsIsEmpty(): boolean {
    return this.getlistOfProducts().length === 0;
  }

  public set_token(token: string): void {
    localStorage.setItem('token', token);
  }

  public get_token(): string {
    const token = localStorage.getItem('token');
    const t = (token !== null) ? token : '';
    return t;
  }

  public delete_token(): void {
    localStorage.removeItem('token');
  }

  public close_session() {
    this.delete_token();
    this.deletePass();
    this.deleteUser();
  }

  public setRol(rol: string): void {
    localStorage.setItem('rol', rol);
  }

  public getRol(): string {
    const rol = localStorage.getItem('rol');
    const r = (rol !== null) ? rol : '';
    return r;
  }


  public setNegocio(negocio: string): void {
    localStorage.setItem('negocio', negocio);
  }

  public getNegocio(): string {
    const negocio = localStorage.getItem('negocio');
    const n = (negocio !== null) ? negocio : '';
    return n;
  }

  public setSucursal(sucursal: string): void {
    localStorage.setItem('sucursal', sucursal);
  }

  public getSucursal(): string {
    const sucursal = localStorage.getItem('sucursal');
    const s = (sucursal !== null) ? sucursal : '';
    return s;
  }

  public setPersona(idPersona: number) {
    localStorage.removeItem('persona');
    localStorage.setItem('persona', idPersona.toString());
  }

  public getPersona(): number {
    const persona = localStorage.getItem('persona');
    if (persona !== null) {
      return parseInt(persona);
    }
    return 0;
  }

  public setPass(pass: string): void {
    localStorage.removeItem('pusuario');
    localStorage.setItem('pusuario', pass);
  }
  public setUsuario(user: string): void {
    localStorage.removeItem('uusuario');
    localStorage.setItem('uusuario', user);
  }

  public getPass(): string {
    const pass = localStorage.getItem('pusuario');
    const p = (pass !== null) ? pass : '';
    return p;
  }

  public getUser(): string {
    const usuario = localStorage.getItem('uusuario');
    const u = (usuario !== null) ? usuario : '';
    return u;
  }

  public deletePass(): void {
    localStorage.removeItem('pusuario');

  }

  public deleteUser(): void {
    localStorage.removeItem('uusuario');
  }

  saveProductsTraslado(list: Array<any>): void {
    this.listOfProductsTraslado = [];
    list.forEach((element: any) => {
      const prod: ProductModel = new ProductModel(element.code,
        element.id,
        element.description,
        element.cost_price,
        element.size,
        element.quantity,
        element.sale_price,
        element.id_proveedor,
        parseInt(this.getNegocio()),
        parseInt(element.sucursal),
        element.nombreSucursal
      );
      this.listOfProductsTraslado.push(prod);
    });
    localStorage.removeItem('listOfProductsTraslado');
    localStorage.setItem('listOfProductsTraslado', JSON.stringify(this.listOfProductsTraslado));

  }
  getProductsTraslado(): Array<ProductModel> {
    let productos = localStorage.getItem('listOfProductsTraslado');
    if (productos !== null) {
      this.listOfProductsTraslado = JSON.parse(productos);
    }
    return this.listOfProductsTraslado;
  }

  guardarVentaCtaCte(array: any) {
    this.carrito = [];
    array.forEach((element: any) => {
      const prod: ProductSaleModel = new ProductSaleModel(
        element.idProduct,
        element.quantity,
        element.price,
        element.typePayment
      );
      this.carrito.push(prod);
    });
    localStorage.removeItem('listOfCarrito');
    localStorage.setItem('listOfCarrito', JSON.stringify(this.carrito));
  }

  getVentasCtaCte(): Array<any> {
    let productos = localStorage.getItem('listOfCarrito');
    if (productos !== null) {
      this.carrito = JSON.parse(productos);
    }
    return this.carrito;
  }

  public setFormaPago(formaPago: string): void {
    localStorage.removeItem('formaPago');
    localStorage.setItem('formaPago', formaPago);
  }

  public getFormaPago(): string {
    const pago = localStorage.getItem('formaPago');
    const p = (pago !== null) ? pago : '';
    return p;
  }

  public guardarCliente(cliente: any) {
    localStorage.removeItem('cliente');
    localStorage.setItem('cliente', JSON.stringify(cliente));
  }

  public getCliente(): any {
    const cliente = localStorage.getItem('cliente');
    const c = (cliente !== null) ? cliente : '';
    return JSON.parse(c);
  }
}
