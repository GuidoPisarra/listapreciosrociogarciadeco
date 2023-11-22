import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CtaCtePage } from './cta-cte.page';

describe('CtaCtePage', () => {
  let component: CtaCtePage;
  let fixture: ComponentFixture<CtaCtePage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(CtaCtePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
