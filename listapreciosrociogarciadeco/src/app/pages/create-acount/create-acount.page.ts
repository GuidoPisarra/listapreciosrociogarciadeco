import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-acount',
  templateUrl: './create-acount.page.html',
  styleUrls: ['./create-acount.page.scss'],
})
export class CreateAcountPage implements OnInit {

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
  }

  protected back(): void {
    this.route.navigate(['login']);
  }

  protected crearUsuario(): void {
    const name = (document.querySelector('#nameCreateAcount') as HTMLInputElement).value;
    const email = (document.querySelector('#emailCreateAcount') as HTMLInputElement).value;
    const password = (document.querySelector('#passwordCreateAcount') as HTMLInputElement).value;
    const repeatPassword = (document.querySelector('#passwordRepeatCreateAcount') as HTMLInputElement).value;

    console.log(name);
    console.log(email);
    console.log(password);
    console.log(repeatPassword);
  }

}
