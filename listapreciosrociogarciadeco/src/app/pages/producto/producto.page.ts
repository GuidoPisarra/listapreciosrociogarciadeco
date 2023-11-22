import { AlertController } from '@ionic/angular';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { LocalRestService } from './../../service/local-rest.service';
import { RestService } from './../../service/rest.service';
import { Router } from '@angular/router';
import { Component } from "@angular/core";
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from "@techiediaries/ngx-qrcode";
import { StorageService } from 'src/app/service/storage.service';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})

export class ProductoPage {
  valor: string = '';
  tipoElemento = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  nombre: string = '';
  talle: string = '';
  precioCosto: number = 0;
  precioVenta: number = 0;
  cantidad: number = 0;
  codigo: string = '';
  productos: Array<any> = [];
  protected scanActiveProd: boolean = false;
  protected ventaCorrecta: boolean = false;

  constructor(
    private rest: RestService,
    private localService: LocalRestService,
    private alertController: AlertController,
    private storage: StorageService

  ) { }

  ionViewDidEnter() {
    this.ventaCorrecta = false;
    this.productos = this.localService.getListOfProducts();
    this.nombre = '';
    this.valor = '';
    this.cantidad = 0;
    this.talle = '';
    this.codigo = '';
    this.precioCosto = 0;
    this.precioVenta = 0;
    const background = document.getElementById('content');
    background?.classList.toggle('fondoResultado');
    this.scanActiveProd = false;
    const addProd = document.getElementById('addProduct');
    if (addProd !== null) {
      (addProd as HTMLElement).hidden = false;

    }
    BarcodeScanner.hideBackground();
  }

  async saveProduct() {

    if (this.formularioVerificado()) {
      const prodAdd = document.getElementById('addProduct') as HTMLElement;
      prodAdd.hidden = true;
      let payload: any;


      let id;
      if (this.codigo === '') {
        const alert = await this.alertController.create({
          header: 'Producto sin codigo',
          message: 'Ud. esta por guardar un producto sin codigo, el mismo generara un codigo QR. ¿Esta seguro de continuar?',
          cssClass: 'custom-alert',
          backdropDismiss: false,
          buttons: ['CANCELAR', {
            text: 'CONTINUAR',
            handler: data => {
              this.codigo = this.nombre + '-' + this.precioCosto + '-' + this.precioVenta + '-' + this.talle + '-' + this.cantidad;
              payload = {

                "description": this.nombre,
                "costPrice": this.precioCosto,
                "salePrice": this.precioVenta,
                "size": this.talle.toString(),
                "quantity": this.cantidad,
                "code": this.codigo,
                "idProveedor": 1,
                "idNegocio": this.storage.getNegocio(),
                "idSucursal": this.storage.getSucursal()


              }
              console.log(payload);
              const result = this.rest.addProduct(payload).subscribe(response => {
                if (response !== null) {
                  this.valor = response.id + '-' + this.nombre + '-' + this.precioCosto + '-' + '-' + this.precioVenta + '-' + this.talle + '-' + this.cantidad;

                  let array: Array<any> = [];
                  array = this.valor!.split('-');
                  id = parseInt(array[0]);
                  payload = {
                    "id": id,
                    "description": this.nombre,
                    "costPrice": this.precioCosto,
                    "salePrice": this.precioVenta,
                    "size": this.talle.toString(),
                    "quantity": this.cantidad,
                    "idNegocio": this.storage.getNegocio(),
                    "idSucursal": this.storage.getSucursal()
                  }
                  console.log(payload);

                  this.productos.push(payload);
                  this.localService.postListOfProducts(this.productos);

                  const background = document.getElementById('content');
                  background?.classList.toggle('fondoResultado');
                  this.ventaCorrecta = true;
                  setTimeout(() => {
                    this.ionViewDidEnter();
                  }, 2000);
                } else {
                  console.log('error')
                }

              }, err => {
                console.log(err)
              });
            }
          }]
        });
        await alert.present();
        prodAdd.hidden = false;
      } else {
        payload = {

          "description": this.nombre,
          "costPrice": this.precioCosto,
          "salePrice": this.precioVenta,
          "size": this.talle.toString(),
          "quantity": this.cantidad,
          "code": this.codigo,
          "idProveedor": 1,
          "idNegocio": this.storage.getNegocio(),
          "idSucursal": this.storage.getSucursal()

        }
        const result = this.rest.addProduct(payload).subscribe(response => {
          if (response !== null) {
            this.valor = response.id + '-' + this.nombre + '-' + this.precioCosto + '-' + '-' + this.precioVenta + '-' + this.talle + '-' + this.cantidad;

            let array: Array<any> = [];
            array = this.valor!.split('-');
            id = parseInt(array[0]);
            payload = {
              "id": id,
              "description": this.nombre,
              "costPrice": this.precioCosto,
              "salePrice": this.precioVenta,
              "size": this.talle.toString(),
              "quantity": this.cantidad,
              "idNegocio": this.storage.getNegocio(),
              "idSucursal": this.storage.getSucursal()
            }
            this.productos.push(payload);
            this.localService.postListOfProducts(this.productos);

            const background = document.getElementById('content');
            background?.classList.toggle('fondoResultado');
            this.ventaCorrecta = true;
            setTimeout(() => {
              this.ionViewDidEnter();
            }, 2000);
          } else {
            console.log('error')
          }

        }, err => {
          console.log(err)
        });
      }


    } else {
      console.log('faltan campos')
    }

  }



  async scanCodeProduct() {
    const background = document.getElementById('content');
    background?.classList.remove('fondoResultado');
    const addProd = document.getElementById('addProduct');
    (addProd as HTMLElement).hidden = true;
    this.scanActiveProd = true;

    BarcodeScanner.prepare();
    await BarcodeScanner.checkPermission({ force: true });
    BarcodeScanner.hideBackground();

    await BarcodeScanner.startScan(
      {
        targetedFormats:
          [SupportedFormat.QR_CODE,
          SupportedFormat.CODE_128,
          ]
      }).then((result) => {
        if (result.hasContent) {
          this.codigo = result.content as string;
        } else {
          alert('Sin resultados');
        }
      }).catch(err => {
        alert(err);
      });
    BarcodeScanner.showBackground();
    this.resultadoScann();
  }

  public resultadoScann() {
    BarcodeScanner.stopScan();
    BarcodeScanner.showBackground();

    this.scanActiveProd = false;
    const background = document.getElementById('content');
    background?.classList.add('fondoResultado');
    const addProd = document.getElementById('addProduct');
    (addProd as HTMLElement).hidden = false;
  }

  private formularioVerificado(): boolean {
    let correcto = false;
    let errNombre = document.querySelector('#errorNombre') as HTMLElement;
    let errPrecioCosto = document.getElementById('errorPrecioCosto') as HTMLElement;
    let errPrecioVenta = document.getElementById('errorPrecioVenta') as HTMLElement;
    let errCantidad = document.getElementById('errorCantidad') as HTMLElement;
    let errTalle = document.getElementById('errorTalle') as HTMLElement;
    let errCodigo = document.getElementById('errorCodigo') as HTMLElement;

    errNombre.hidden = true;
    errPrecioCosto.hidden = true;
    errPrecioVenta.hidden = true;
    errCantidad.hidden = true;
    errTalle.hidden = true;
    errCodigo.hidden = true;

    if (this.nombre === '') {
      errNombre.hidden = false;
    }
    if (this.precioCosto === 0) {
      errPrecioCosto.hidden = false;
    }
    if (this.precioVenta === 0) {
      errPrecioVenta.hidden = false;
    }
    if (this.cantidad === 0) {
      errCantidad.hidden = false;
    }
    if (this.talle === '') {
      errTalle.hidden = false;
    }
    if (errCantidad.hidden && errNombre.hidden && errPrecioCosto.hidden && errPrecioVenta.hidden && errTalle.hidden) {
      correcto = true;
    }

    return correcto;
  }

  addOther() {

    this.ionViewDidEnter();
  }


}
