import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTradeComponent } from './cancel-trade.component';

describe('CancelTradeComponent', () => {
  let component: CancelTradeComponent;
  let fixture: ComponentFixture<CancelTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
