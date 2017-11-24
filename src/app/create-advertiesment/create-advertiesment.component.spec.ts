import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvertiesmentComponent } from './create-advertiesment.component';

describe('CreateAdvertiesmentComponent', () => {
  let component: CreateAdvertiesmentComponent;
  let fixture: ComponentFixture<CreateAdvertiesmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAdvertiesmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdvertiesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
