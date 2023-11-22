import { Component } from '@angular/core';
import { RestService } from './../../service/rest.service';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage {
  protected cantidadProductos: number = 0;
  constructor(
    private rest: RestService
  ) { }

  ionViewDidEnter() {
    this.rest.getProducts().subscribe(response => {
      this.cantidadProductos = response.length;
    });
  }

  protected backupProducts(): void {
    this.rest.backupProducts();
  }

}
