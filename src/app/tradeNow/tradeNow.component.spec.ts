import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeNowComponent } from './tradeNow.component';

describe('TradeNowComponent', () => {
  let component: TradeNowComponent;
  let fixture: ComponentFixture<TradeNowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeNowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
