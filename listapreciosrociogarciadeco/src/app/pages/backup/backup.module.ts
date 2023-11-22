import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './../../components/components.module';

import { IonicModule } from '@ionic/angular';

import { BackupPageRoutingModule } from './backup-routing.module';

import { BackupPage } from './backup.page';

@NgModule({
  imports: [
  CommonModule,
    FormsModule,
    IonicModule,
    BackupPageRoutingModule,
    ComponentsModule

  ],
  declarations: [BackupPage]
})
export class BackupPageModule {}
