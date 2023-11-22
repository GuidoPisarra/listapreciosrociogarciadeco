import { NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { RestService } from './../../service/rest.service';
import { ProductModel } from './../../models/productModel';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import * as htmlToImage from 'html-to-image';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-codigos-qr',
  templateUrl: './codigos-qr.page.html',
  styleUrls: ['./codigos-qr.page.scss'],
})
export class CodigosQRPage {
  @ViewChild('content', { static: false }) content: ElementRef | undefined;

  protected products: Array<ProductModel> = [];
  protected productsQR: Array<ProductModel> = [];
  protected tipoElemento = NgxQrcodeElementTypes.CANVAS;
  protected correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  protected listaQrParaImprimir: Array<ProductModel> = [];
  protected cargando: boolean = true;
  protected selectedSize: string = 'Mediano';
  protected tamañoImagen: string = '120px';


  public results: Array<ProductModel> = [];


  constructor(
    private rest: RestService,
    private platform: Platform,
    private alertController: AlertController
  ) { }

  ionViewDidEnter() {
    this.products = [];
    this.productsQR = [];
    this.listaQrParaImprimir = [];
    this.cargando = true;
    const result: Observable<any> = this.rest.getProducts();
    result.subscribe(response => {
      response['datos'].forEach((element: ProductModel) => {
        //console.log(response);
        this.products.unshift(element);
        if (element.code.indexOf("-") !== -1) {
          this.productsQR.unshift(element);
        } else {
          this.productsQR.unshift(element);
        }
      });
      this.results = this.productsQR;
      console.log(this.results);
      console.log(this.productsQR);
      this.cargando = false;
    }, err => {
      this.cargando = false;
      console.log(err);
    });
  }
  async printContent(): Promise<any> {
    if (this.listaQrParaImprimir.length > 0) {
      this.platform.ready().then(() => {
        let printContents: any, popupWin: any;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin?.document.open();
        this.listaQrParaImprimir.forEach(async item => {
          popupWin.document.write(`
          <html>
            <head>
              <title>Imprimir Contenido</title>
                <body onload="window.print();window.close()">
                </body>

                <div class="list">
                  <div class="cardQr">
                    <img src="`+ item.codeCanvas + `"/>
                    <ion-item class="itemQr" lines="none">
                      <label class="descripcion">`+ item.description + `</label>
                    </ion-item>
                    <ion-item class="itemQr" lines="none">
                      <ion-label>Detalle: `+ item.size + `</ion-label>
                    </ion-item>
                  </div>
                </div>
                <style>
                .list{
                  display: inline-block;
                }
                .cardQr{
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-right: 20px;
                }
                img{
                  height: `+ this.tamañoImagen + `;
                  width: `+ this.tamañoImagen + `;
                }
                .descripcion{
                  display:flex;
                  max-width: 110px !important;
                  word-wrap: break-word !important;
                  overflow-y: visible !important;
                  margin-left: 20px;
                }

                </style>
            </head>

          </html>`
          );

        });

        popupWin?.document.close();
      });
    } else {
      const alert = await this.alertController.create({
        header: 'Ud. no seleccionó ningún elemento',
        buttons: [
          {
            text: 'Volver',
            role: 'cancel'
          }
        ],
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
    }

  }


  seleccionarItemParaImpresion(id: number, ev: any): void {
    this.productsQR.forEach(item => {
      if (item.id === id) {
        if (!ev.target.checked) {

          let prodToListQr = (document.getElementById('qr' + item.id) as HTMLElement);

          let img: string = '';
          htmlToImage.toCanvas(prodToListQr).then(canvas => {
            canvas.getContext('2d');
            img = canvas.toDataURL('image/jpeg');
            item.codeCanvas = img;
            this.listaQrParaImprimir.push(item);
          });
        } else {
          this.listaQrParaImprimir = this.listaQrParaImprimir.filter(prod => prod.id !== id);
        }
      }
    });
  }

  handleChange(event: any): void {
    const query = event.target.value.toLowerCase();
    this.results = this.productsQR.filter(d => d.description.toLowerCase().indexOf(query) > -1);
  }

  protected clear(): void {
    this.listaQrParaImprimir = [];
    document.querySelectorAll('.checkbox').forEach(item => {
      (item as HTMLIonCheckboxElement).checked = false;
    })
  }

  tamanioSeleccionado(ev: any) {
    this.tamañoImagen = ev.target.value;
  }

}
