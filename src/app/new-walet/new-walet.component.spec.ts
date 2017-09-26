import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWaletComponent } from './new-walet.component';

describe('NewWaletComponent', () => {
  let component: NewWaletComponent;
  let fixture: ComponentFixture<NewWaletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWaletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWaletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
