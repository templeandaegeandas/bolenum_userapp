import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsServiceComponent } from './terms-service.component';

describe('TermsServiceComponent', () => {
  let component: TermsServiceComponent;
  let fixture: ComponentFixture<TermsServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
