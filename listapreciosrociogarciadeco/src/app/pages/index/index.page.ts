
import { RestService } from './../../service/rest.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageService } from './../../service/storage.service';
import { Network } from '@capacitor/network';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  protected conexion: boolean = true;
  protected cargando: boolean = true;
  protected usuario: boolean = this.storage.getRol() === 'USER';
  constructor(
    public router: Router,
    public rest: RestService,
    public storage: StorageService,
  ) {

  }
  ngOnInit(): void {
    this.cargando = true;
    const result: Observable<any> = this.rest.getProducts();
    result.subscribe(response => {
      this.cargando = false;
    }, err => {
      console.log(err);
      this.cargando = false;
    });
  }


  ionViewDidEnter() {
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
    /* Fin listener conexion a internet */
    const status = Network.getStatus().then((e) => {
      this.conexion = e.connected;

    });


  }



  seeProduct() {
    if (this.conexion) {
      this.router.navigate(['producto']);
    } else {
      alert('Sin conexión a internet');
    }
  }




}
