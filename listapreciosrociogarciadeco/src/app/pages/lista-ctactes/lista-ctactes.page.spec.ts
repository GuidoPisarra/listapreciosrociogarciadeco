import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListaCtactesPage } from './lista-ctactes.page';

describe('ListaCtactesPage', () => {
  let component: ListaCtactesPage;
  let fixture: ComponentFixture<ListaCtactesPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(ListaCtactesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
