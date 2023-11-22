import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() titulo: string;
  @Input() verBackButton: string;
  @Input() verMenu: string;

  constructor(
    private routes: Router
  ) {
    this.titulo='';
    this.verBackButton='false';
    this.verMenu='true';
   }

  ngOnInit() {}

  public back(){
    this.routes.navigate(['index']);
  }



}
