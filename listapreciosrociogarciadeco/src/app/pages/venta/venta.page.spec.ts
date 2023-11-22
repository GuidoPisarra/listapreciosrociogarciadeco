import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VentaPage } from './venta.page';

describe('VentaPage', () => {
  let component: VentaPage;
  let fixture: ComponentFixture<VentaPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(VentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
