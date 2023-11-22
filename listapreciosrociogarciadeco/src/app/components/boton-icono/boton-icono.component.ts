import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-boton-icono',
  templateUrl: './boton-icono.component.html',
  styleUrls: ['./boton-icono.component.scss']
})
export class BotonIconoComponent implements OnInit {
  @Input() icono: string = '';
  @Input() texto: string = '';
  @Input() ref: string = '';

  constructor() { }

  ngOnInit() { }

}
