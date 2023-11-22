import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProductModel } from 'src/app/models/productModel';
import { RestService } from 'src/app/service/rest.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cambio',
  templateUrl: './cambio.page.html',
  styleUrls: ['./cambio.page.scss'],
})
export class CambioPage {
  protected cambioCorrecto: boolean = false;
  protected nombreProductoOriginal: string = '';
  protected nombreProductoCambio: string = '';
  protected precioProductoOriginal: number = 0;
  protected precioProductoCambio: number = 0;
  protected diferenciaPrecio: number = 0;
  protected inputPrecioOriginal: any = document.querySelector('#inputPrecioOriginal');
  protected btnProductoOriginal: any = document.querySelector('#btnProductoOriginal');
  protected btnProductoOriginalScanner: any = document.querySelector('#btnProductoOriginalScanner');
  protected inputPrecioCambio: any = document.querySelector('#inputPrecioCambio');

  protected cargando: boolean = true;
  protected listadoProductos: Array<ProductModel> = [];
  protected results: Array<any> = [];

  protected result: string = '';

  protected resultProdVendido: any;
  protected resultProdNuevo: any;
  protected scanActive: boolean = false;


  constructor(
    private storage: StorageService,
    private rest: RestService,
    private alertController: AlertController,

  ) { }

  ionViewDidEnter() {
    this.scanActive = false;
    if (!this.storage.listOfProductsIsEmpty()) {
      this.storage.getlistOfProducts().forEach(item => {
        this.results.push(item);
        this.listadoProductos.push(item);
      });
      this.cargando = false;
    } else {
      const result: Observable<any> = this.rest.getProducts();
      result.subscribe(response => {
        response['datos'].forEach((element: any) => {
          this.listadoProductos.push(element);
          this.results.push(element);
        });
        this.cargando = false;
      }, err => {
        console.log(err);
        this.cargando = false;
      });

    }
  }



  protected calcularDiferencia(): void {
    const inputPrecioOriginal = document.querySelector('#inputPrecioOriginal');
    const inputPrecioCambio = document.querySelector('#inputPrecioCambio');
    const precioOriginal = parseFloat((inputPrecioOriginal as HTMLInputElement).value);
    const preciocambio = parseFloat((inputPrecioCambio as HTMLInputElement).value);
    this.diferenciaPrecio = precioOriginal - preciocambio;
  }

  protected async buscarVendido() {
    console.log('vendido');
    this.scanActive = true;



    const alert = await this.alertController.create({
      header: 'Usted no puede vender ',
      message: `Posee en stock: ` + ' unidades.',

      buttons: [
        {
          text: 'Continuar',
          role: 'confirm',
        },
      ],
    });
    await alert.present()
  }
  protected async buscarVendidoScanner() {
    console.log('vendidoScann');
    this.scanActive = true;
    const background = document.getElementById('content');
    background?.classList.remove('fondoResultado');
    BarcodeScanner.prepare();
    await BarcodeScanner.checkPermission({ force: true });

    BarcodeScanner.hideBackground();

    await BarcodeScanner.startScan(
      {
        targetedFormats:
          [SupportedFormat.QR_CODE,
          SupportedFormat.CODE_128
          ]
      }).then((result) => {
        if (result.format === 'QR_CODE') {
          //TODO mejorar esto
          if (result.hasContent) {
            let product = this.rest.getOneProduct(result.content);
            product.subscribe(async item => {
              this.resultProdVendido = new ProductModel(
                item.code,
                item.id,
                item.description,
                item.costPrice,
                item.size,
                1,
                item.salePrice,
                item.idProveedor,
                parseInt(this.storage.getNegocio()),
                parseInt(item.sucursal),
                item.nombre_sucursal
              );
              this.nombreProductoOriginal = this.resultProdVendido.getDescription();
              this.precioProductoOriginal = this.resultProdVendido.getSalePrice();
              this.diferenciaPrecio = this.precioProductoOriginal - this.precioProductoCambio;
            });
          } else {
            alert('Sin resultados');
          }
        } else {
          if (result.hasContent) {
            let product = this.rest.getOneProduct(result.content);
            product.subscribe(async item => {
              this.resultProdVendido = new ProductModel(
                item.code,
                item.id,
                item.description,
                item.costPrice,
                item.size,
                1,
                item.salePrice,
                item.idProveedor,
                parseInt(this.storage.getNegocio()),
                parseInt(item.sucursal),
                item.nombre_sucursal
              );
              this.nombreProductoOriginal = this.resultProdVendido.getDescription();
              this.precioProductoOriginal = this.resultProdVendido.getSalePrice();
              this.diferenciaPrecio = this.precioProductoOriginal - this.precioProductoCambio;
            });

          } else {
            alert('Sin resultados');
          }

        }
      }).catch(err => {
        alert(err);
      });
    BarcodeScanner.showBackground();
    this.resultadosScaneo();
  }

  protected async buscarNuevo() {
    console.log('nuevo');
    const alert = await this.alertController.create({
      header: 'Usted no puede vender ',
      message: `Posee en stock: ` + ' unidades.',
      inputs: [
        {
          type: 'text',
          value: '',
        },
        {
          type: 'text',
          value: ''
        }
      ],
      buttons: [
        {
          text: 'Continuar',
          role: 'confirm',
        },
      ],
    });
    await alert.present()
  }
  protected async buscarNuevoScanner() {
    console.log('vendidoScann');
    this.scanActive = true;
    const background = document.getElementById('content');
    background?.classList.remove('fondoResultado');
    BarcodeScanner.prepare();
    await BarcodeScanner.checkPermission({ force: true });

    BarcodeScanner.hideBackground();

    await BarcodeScanner.startScan(
      {
        targetedFormats:
          [SupportedFormat.QR_CODE,
          SupportedFormat.CODE_128
          ]
      }).then((result) => {
        if (result.format === 'QR_CODE') {
          //TODO mejorar esto
          if (result.hasContent) {
            let product = this.rest.getOneProduct(result.content);
            product.subscribe(async item => {
              this.resultProdNuevo = new ProductModel(
                item.code,
                item.id,
                item.description,
                item.costPrice,
                item.size,
                1,
                item.salePrice,
                item.idProveedor,
                parseInt(this.storage.getNegocio()),
                parseInt(item.sucursal),
                item.nombre_sucursal
              );
              this.nombreProductoCambio = this.resultProdNuevo.getDescription();
              this.precioProductoCambio = this.resultProdNuevo.getSalePrice();
              this.diferenciaPrecio = this.precioProductoOriginal - this.precioProductoCambio;
            });
          } else {
            alert('Sin resultados');
          }
        } else {
          if (result.hasContent) {
            let product = this.rest.getOneProduct(result.content);
            product.subscribe(async item => {
              this.resultProdNuevo = new ProductModel(
                item.code,
                item.id,
                item.description,
                item.costPrice,
                item.size,
                1,
                item.salePrice,
                item.idProveedor,
                parseInt(this.storage.getNegocio()),
                parseInt(item.sucursal),
                item.nombre_sucursal
              );
              this.nombreProductoCambio = this.resultProdNuevo.getDescription();
              this.precioProductoCambio = this.resultProdNuevo.getSalePrice();
              this.diferenciaPrecio = this.precioProductoOriginal - this.precioProductoCambio;
            });

          } else {
            alert('Sin resultados');
          }

        }
      }).catch(err => {
        alert(err);
      });
    BarcodeScanner.showBackground();
    this.resultadosScaneo();
  }

  private resultadosScaneo() {
    this.scanActive = false;
    const background = document.getElementById('content');
    background?.classList.add('fondoResultado');
  }

  protected async realizarCambio() {
    const payload = {
      "id_producto_cambio": this.resultProdVendido.id,
      "precio_producto_cambio": this.resultProdVendido.salePrice,
      "id_producto_nuevo": this.resultProdNuevo.id,
      "precio_producto_nuevo": this.resultProdNuevo.salePrice,
      "id_negocio": this.storage.getNegocio()
    }

    if (await this.rest.realizarCambio(payload)) {
      this.cambioCorrecto = true;
      setTimeout(() => {
        this.cambioCorrecto = false;
        this.limpiarCampos();
      }, 3000);
    }
  }

  protected limpiarCampos(): void {
    this.precioProductoCambio = 0;
    this.precioProductoOriginal = 0;
    this.resultProdNuevo = null;
    this.resultProdVendido = null;
    this.nombreProductoCambio = '';
    this.nombreProductoOriginal = '';
    this.diferenciaPrecio = 0;
  }


}
