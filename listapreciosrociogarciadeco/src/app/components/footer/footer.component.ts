import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  protected usuario: boolean = this.storage.getRol() === 'USER';
  protected desktop: boolean = this.platform.is("desktop");
  constructor(
    private routes: Router,
    private storage: StorageService,
    private platform: Platform
  ) { }

  ngOnInit() { }
  public goTo(route: string) {
    if (route === 'scanner' && !this.desktop) {
      this.routes.navigate([route])
    }
  }
}
