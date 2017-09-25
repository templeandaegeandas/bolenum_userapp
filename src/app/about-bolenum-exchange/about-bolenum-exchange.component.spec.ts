import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBolenumExchangeComponent } from './about-bolenum-exchange.component';

describe('AboutBolenumExchangeComponent', () => {
  let component: AboutBolenumExchangeComponent;
  let fixture: ComponentFixture<AboutBolenumExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutBolenumExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutBolenumExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
