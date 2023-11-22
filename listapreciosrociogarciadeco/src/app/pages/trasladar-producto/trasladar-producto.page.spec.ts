import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TrasladarProductoPage } from './trasladar-producto.page';

describe('TrasladarProductoPage', () => {
  let component: TrasladarProductoPage;
  let fixture: ComponentFixture<TrasladarProductoPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(TrasladarProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
