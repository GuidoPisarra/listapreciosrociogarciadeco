import { ExpenseModel } from './../models/expenseModel';
import { ProductModel } from './../models/productModel';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { IncomesExpensesModel } from './../models/incomesExpensesModel';
import * as FileSaver from 'file-saver';
import { StorageService } from './storage.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RestService {
  private api = environment.baseUrl;


  constructor(
    public http: HttpClient,
    public storage: StorageService
  ) { }

  login(user: string, pass: string) {
    const path = `${this.api}/usuario/login`
    const payload = {
      'username': user,
      'password': pass
    };
    const data = this.http.post<any>(path, payload);

    return data;
  }

  getProducts() {
    const path = `${this.api}/products/products_list/` + this.storage.getNegocio();
    const data = this.http.get<any[]>(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    this.storage.saveProducts(data);
    return data;

  }

  getOneProduct(code: any): Observable<any> {
    let product: any;
    this.storage.getlistOfProducts().forEach(item => {
      if (item.code == code) {
        product = item;
      }
    });
    if (product !== undefined) {
      return from(new Promise((resolve, reject) => {
        // Simulación de una solicitud asincrónica
        setTimeout(() => {
          resolve(product);
        }, 1000);
      }));
    } else {
      const path = `${this.api}/products_one/` + code + '/' + this.storage.getNegocio();
      const data = this.http.get<ProductModel>(path);
      return data;

    }

  }

  deleteProduct(id: number) {
    const path = `${this.api}/products/products/delete`;

    const payload = {
      "id": id
    }

    const data = this.http.post<ProductModel>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return data;
  }

  addProduct(payload: any) {
    const path = `${this.api}/products/products`;
    const createProduct = this.http.post<ProductModel>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return createProduct;

  }

  salesReport() {
    const path = `${this.api}/report/salesProduct/` + this.storage.getNegocio();
    const salesReport = this.http.get<any[]>(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return salesReport;

  }

  increasePriceWithPercentaje(percentage: number, proveedor: number) {
    const path = `${this.api}/products/products/price_percent/` + percentage + '/' + this.storage.getNegocio() + '/' + proveedor;
    const a = this.http.get(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    a.subscribe(item => {
      //console.log(item);
    })
    return true;
  }

  addStock(payload: any) {
    const path = `${this.api}/products/products/stock`;
    const incrementStock = this.http.post<ProductModel>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return incrementStock;
  }

  editOneProduct(payload: ProductModel) {
    const path = `${this.api}/products/editOneProduct`;
    const changePriceOneProduct = this.http.post<ProductModel>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    changePriceOneProduct.subscribe(item => {
      //console.log(item);
    });
    return changePriceOneProduct;
  }

  saveExpense(payload: any) {
    const path = `${this.api}/expenses/expenses`;
    const newExpense = this.http.post<any>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    newExpense.subscribe(item => {
      //console.log(item);
    });
    return newExpense;
  }

  getExpenses() {
    const path = `${this.api}/expenses/expenses/` + this.storage.getNegocio();
    const data = this.http.get<ExpenseModel[]>(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return data;
  }

  getBalance(month: number, year: number) {
    const data = this.http.get<IncomesExpensesModel>(this.api + '/report/incomesExpenses/' + month + '/' + year + '/' + this.storage.getNegocio(), {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return data;
  }

  saveSales(payload: any) {
    const path = `${this.api}/salesProduct/salesProduct`
    const saveSale = this.http.post<ProductModel>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    this.storage.saveSale(payload);

    return saveSale;
  }

  backupProducts() {
    const path = `${this.api}/downloadProduct`
    const backupProduct = this.http.get(path);
    backupProduct.subscribe(response => {
      //console.log(response);
    },
      error => {
        const blob = new Blob([error.error.text], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, 'backupProductos.csv');
      }
    );
    return this.backupProducts;
  }

  realizarCambio(payload: any): any {
    const path = `${this.api}/changes/change`;
    console.log(payload);
    const change = this.http.post<any>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    change.subscribe(response => {
      console.log(response);
    });
    return change;
  }

  obtenerNegocios(id: string) {
    const path = `${this.api}/negocio/obtener_negocios/` + id;
    const data = this.http.get<any[]>(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });

    return data;
  }

  nuevoNegocio(payload: any) {
    const path = `${this.api}/negocio/nuevo_negocio`;
    const newNegocio = this.http.post<any>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return newNegocio;
  }

  eliminarNegocio(payload: any) {
    const path = `${this.api}/negocio/eliminar_negocio`;
    const eliminarNegocio = this.http.post<any>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return eliminarNegocio;
  }

  sendTraslado(items: Array<any>): Observable<any> {
    const path = `${this.api}/products/trasladar_products`
    const trasladar = this.http.post<any>(path, items, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });

    return trasladar;
  }

  getClientes() {
    const path = `${this.api}/clientes/obtener_clientes/` + this.storage.getNegocio();
    const data = this.http.get<any[]>(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });

    return data;
  }

  venderCtaCte(payload: any) {
    console.log(payload);
    const path = `${this.api}/cuenta_corriente/agregar_venta_cuenta_corriente`
    const venderCtaCte = this.http.post<any>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });

    return venderCtaCte;
  }

  getClientesCtaCte() {
    const path = `${this.api}/cuenta_corriente/obtener_cuentas_corrientes/` + this.storage.getNegocio();
    const cuentas = this.http.get<any[]>(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });

    return cuentas;
  }

  getMovimientosCliente(id: number) {
    const path = `${this.api}/cuenta_corriente/obtener_movimientos_cliente/` + id;
    const movimientos = this.http.get<any[]>(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });

    return movimientos;
  }

  registrarPago(payload: any) {
    const path = `${this.api}/cuenta_corriente/agregar_pago`
    const regitroPago = this.http.post<any>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return regitroPago;
  }

  saveCliente(payload: any) {
    const path = `${this.api}/cuenta_corriente/agregar_cliente`
    const registrarCliente = this.http.post<any>(path, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return registrarCliente;
  }

  getProveedores() {
    const path = `${this.api}/proveedores/proveedores_list/` + this.storage.getNegocio();
    const proveedores = this.http.get<any>(path, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.storage.get_token()}`
      }
    });
    return proveedores;
  }
}
