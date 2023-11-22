import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';
import { StorageService } from 'src/app/service/storage.service';
import { environment } from 'src/environments/environment.prod';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Platform } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  protected cargando: boolean = false;
  protected version = environment.version;
  protected secretKey = environment.secret_key;
  protected error: boolean = false;
  protected password = '';
  protected finger_print = false;

  constructor(
    private route: Router,
    private rest: RestService,
    private storage: StorageService,
    private platform: Platform
  ) { }

  async ngOnInit() {

  }

  async ionViewDidEnter() {
    const result = await NativeBiometric.isAvailable();
    if (!this.platform.is('desktop') && !this.platform.is('ios') && !this.platform.is('iphone')) {
      console.log(result);

      const verified = await NativeBiometric.verifyIdentity({
        title: 'Ingresá con tu huella digital',
        description: 'Toca el sensor de huellas dactilares de tu celular',
      }).then(() => {

        if (this.storage.getUser() !== '' && this.storage.getPass() !== '') {
          const p = CryptoJS.AES.decrypt(this.storage.getPass(), this.secretKey).toString(CryptoJS.enc.Utf8);
          const u = CryptoJS.AES.decrypt(this.storage.getUser(), this.secretKey).toString(CryptoJS.enc.Utf8);
          this.login(u, p);
        }
      }).catch(() => {
        setTimeout(() => {

        }, 3000);
      });




    }
  }

  protected ingresar(): void {
    this.cargando = true;
    this.error = false;
    const email = (document.querySelector('#email') as HTMLInputElement).value;
    const password = (document.querySelector('#password_input') as HTMLInputElement).value;
    this.login(email, password);
  }

  protected login(u: string, p: string): void {
    const login = this.rest.login(u, p);
    login.subscribe(response => {
      if (response['token'] !== null) {
        this.storage.set_token(response['token']);
        const rol = response['rol'];
        const id_negocio = response['id_negocio'];
        this.storage.setRol(rol.match(/"ROLE_(.*?)"/)[1]);
        this.storage.setPersona(response['id']);
        this.storage.setSucursal(response['sucursal']);
        this.storage.setNegocio(id_negocio);
        this.storage.setUsuario(CryptoJS.AES.encrypt(u, this.secretKey).toString());
        this.storage.setPass(CryptoJS.AES.encrypt(p, this.secretKey).toString());

        this.route.navigate(['/index']);
        this.cargando = false;
      } else {
        console.log('pass invalida');
        this.cargando = false;
        this.error = true;
        this.password = '';
      }
    }, err => {
      console.log(err);
      this.cargando = false;
      this.error = true;
      this.password = '';
    });
  }

  protected crearCuenta(): void {
    this.route.navigate(['create-acount']);
  }

  protected limpiarMensajes() {
    this.error = false;
  }

  protected cambiar_icono(): void {
    const input_password: any = document.getElementById('password_input');
    const eye_icon: any = document.querySelector('.icono');
    if (input_password.type !== 'text') {
      input_password.type = 'text';
      eye_icon.src = 'assets/icon/eye-solid.svg';
    } else {
      input_password.type = 'password';
      eye_icon.src = 'assets/icon/eye-slash-solid.svg';
    }
  }


}
