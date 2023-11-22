import { ProductSaleModel } from './../../models/productSaleModel';
import { RestService } from './../../service/rest.service';
import { LocalRestService } from './../../service/local-rest.service';
import { ProductModel } from './../../models/productModel';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})

export class ScannerPage implements OnInit, OnDestroy {
  protected result: string = '';
  protected carrito: Array<ProductModel> = [];
  protected resultProd!: ProductModel;
  protected resultProdDatos!: ProductModel;
  protected carritoVendido: Array<ProductSaleModel> = [];

  protected scanActive: boolean = true;
  protected quantityForSale: number = 1;
  protected formaPago!: string;
  protected ventaCorrecta: boolean = false;
  protected total: number = 0;

  protected conexion: boolean = true;

  constructor(
    private localRest: LocalRestService,
    private router: Router,
    private rest: RestService,
    private alertController: AlertController,
    private storage: StorageService
  ) {
    // BarcodeScanner.prepare();
    this.carrito = [];
    this.carritoVendido = [];
    this.total = 0;
  }

  ngOnInit(): void {
    this.carrito = [];
    this.carritoVendido = [];
    this.total = 0;
    BarcodeScanner.stopScan();
  }

  ngOnDestroy(): void {
    this.carrito = [];
    this.carritoVendido = [];
    this.total = 0;
  }
  /*   ionViewDidEnter() {
      const prod = new ProductSaleModel(213, 3, 6518, '');
      const prod2 = new ProductSaleModel(3, 2, 909, '');
      // (" body m/l - negro -2500-5000-6M-1", 213, " body m/l - negro ", 2500, "6M", 1, 5535, 1, 1, 0, "Francesca Baby & Kids")
      this.carritoVendido.push(prod);
      this.carritoVendido.push(prod2);
      console.log(this.carritoVendido);

      this.finalizarVenta();

    } */

  async ionViewDidEnter() {
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
    });

    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();

      console.log('Network status:', status);
    };

    Network.addListener('networkStatusChange', status_in => {
      this.conexion = status_in.connected;

    });
    // Fin listener conexion a internet
    const status = Network.getStatus().then((e) => {
      this.conexion = e.connected;

    });


    this.ventaCorrecta = false;
    const background = document.getElementById('content');
    background?.classList.remove('fondoResultado');
    this.scanActive = true;

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
              if (item.quantity > 0) {
                this.resultProd = new ProductModel(item.code, item.id, item.description, item.costPrice, item.size, 1, item.salePrice, 1, parseInt(this.storage.getNegocio()), parseInt(item.sucursal), item.nombre_sucursal);
                this.resultProdDatos = new ProductModel(item.code, item.id, item.description, item.costPrice, item.size, item.quantity, item.salePrice, 1, parseInt(this.storage.getNegocio()), parseInt(item.sucursal), item.nombre_sucursal);
                this.carrito.push(this.resultProd);
                this.total = this.total + item.salePrice;
              } else {
                const alert = await this.alertController.create({
                  header: 'Usted no puede vender ' + item.description,
                  message: `Posee en stock: ` + item.quantity + ' unidades.',
                  buttons: [
                    {
                      text: 'Continuar',
                      role: 'confirm',
                    },
                  ],
                });
                await alert.present();

                const { role } = await alert.onDidDismiss();
              }
            });
            background?.classList.add('fondoResultado');


          } else {
            alert('Sin resultados');
          }
        } else {
          if (result.hasContent) {
            let product = this.rest.getOneProduct(result.content);
            product.subscribe(async item => {
              if (item.quantity > 0) {
                this.resultProd = new ProductModel(item.code, item.id, item.description, item.costPrice, item.size, 1, item.salePrice, 1, parseInt(this.storage.getNegocio()), parseInt(item.sucursal), item.nombre_sucursal);
                this.resultProdDatos = new ProductModel(item.code, item.id, item.description, item.costPrice, item.size, item.quantity, item.salePrice, 1, parseInt(this.storage.getNegocio()), parseInt(item.sucursal), item.nombre_sucursal);
                this.carrito.push(this.resultProd);
                this.total = this.total + item.salePrice;
              } else {
                const alert = await this.alertController.create({
                  header: 'Usted no puede vender ' + item.description,
                  message: `Posee en stock: ` + item.quantity + ' unidades.',
                  buttons: [
                    {
                      text: 'Continuar',
                      role: 'confirm',
                    },
                  ],
                });
                await alert.present();

                const { role } = await alert.onDidDismiss();
              }
            });
            background?.classList.add('fondoResultado');

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
    background?.classList.remove('fondoScanner');
  }

  handleChange(ev: any) {
    this.formaPago = ev.target.value;
  }


  public async finalizarVenta() {
    if (this.conexion) {

      const cantProd = document.querySelectorAll('.cantProd');
      // TODO descomentar!!!!!!!!!!!!!!!!!!!!!!!!
      this.carrito[this.carrito.length - 1].quantity = parseInt((cantProd[cantProd.length - 1] as HTMLInputElement).value);

      const alert = await this.alertController.create({
        header: 'Elija la forma de pago',
        message: ``,
        inputs: [
          {
            type: 'radio',
            label: 'Efectivo',
            value: 'Efectivo',
            checked: true
          },
          {
            type: 'radio',
            label: 'Tarjeta de crédito',
            value: 'Tarjeta de crédito'
          },
          {
            type: 'radio',
            label: 'Cuenta DNI',
            value: 'Cuenta DNI'
          },
          {
            type: 'radio',
            label: 'Cta Cte',
            value: 'Cta Cte'
          }
        ],

        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Vender',
            role: 'confirm',
            handler: (data) => {
              this.formaPago = data;
              this.carrito.forEach(element => {
                //CON ESTO DE ABAJIO NO DA ERROR PROBARRRRR!!!!!
                const newProdVendido: ProductSaleModel = new ProductSaleModel(element.id, element.quantity, element.salePrice, this.formaPago);
                newProdVendido.setIdNegocio(parseInt(this.storage.getNegocio()));
                newProdVendido.setPersona(this.storage.getPersona());
                //const newProdVendido = new ProductSaleModel(element.id, element.quantity, element.salePrice, this.formaPago);
                this.carritoVendido.push(newProdVendido);
              });
              const background = document.getElementById('content');
              background?.classList.add('fondoResultado');

              if (this.formaPago === 'Cta Cte') {
                this.storage.guardarVentaCtaCte(this.carritoVendido);
                this.carrito = [];
                this.carritoVendido = [];
                this.router.navigate(['/cta-cte']);
              } else {
                this.storage.guardarVentaCtaCte(this.carritoVendido);
                this.storage.setFormaPago(this.formaPago);
                this.carrito = [];
                this.carritoVendido = [];
                this.router.navigate(['/venta']);
                /* this.rest.saveSales(this.carritoVendido);
                this.ventaCorrecta = true;
                setTimeout(() => {
                  this.ionViewDidEnter();
                  this.carrito = [];
                  this.carritoVendido = [];
                  this.total = 0;
                }, 2000); */
              }

            },
          },
        ],
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
    } else {
      alert('Sin conexión a internet.')
    }


  }


  public agregarAlCarritoVentas() {
    let cantidadVendida: number = 0;

    if (this.resultProd !== undefined) {
      const listado = document.querySelectorAll('.cantProd');
      let inputCantidad = document.getElementById(this.resultProd.id.toString());


      cantidadVendida = parseInt((inputCantidad as HTMLInputElement).value);
      this.carrito.forEach(element => {
        if (element.id === this.resultProd.id) {
          element.quantity = cantidadVendida;
        }
      });
      const background = document.getElementById('content');
      background?.classList.add('fondoResultado');
    }


    this.ionViewDidEnter();
  }

  async modificarCantidad(id: number, indexProduct: number) {

    let inputCantidad = document.getElementById(this.resultProd.id.toString());
    const cantidad = parseInt((inputCantidad as HTMLInputElement).value);

    if (this.resultProdDatos.quantity < cantidad) {
      const alert = await this.alertController.create({
        header: 'Usted no puede vender ' + cantidad + ' ' + this.resultProdDatos.description,
        message: `Posee en stock: ` + this.resultProdDatos.quantity + ' unidades.',
        buttons: [
          {
            text: 'Continuar',
            role: 'confirm',
            handler: (data) => {
              (inputCantidad as HTMLInputElement).value = '1';

            },
          },
        ],
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
    } else {
      this.total = 0;
      this.carrito[indexProduct].quantity = cantidad;
      this.carrito.forEach(item => {
        this.total = this.total + (item.quantity * item.salePrice);
      });
    }



  }

  quitarDelCarrito(id: number, index: number) {
    this.carrito.splice(index, 1);
    this.total = 0;
    this.carrito.forEach(item => {
      this.total = this.total + (item.quantity * item.salePrice);
    });
  }

  vaciar() {
    this.carrito = [];
    this.carritoVendido = [];
    this.total = 0;
    console.log('object');
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan(); // Detener la cámara cuando la página se va a cerrar
  }

}
