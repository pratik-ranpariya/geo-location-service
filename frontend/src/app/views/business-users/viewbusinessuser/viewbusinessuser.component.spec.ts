import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbusinessuserComponent } from './viewbusinessuser.component';

describe('ViewbusinessuserComponent', () => {
  let component: ViewbusinessuserComponent;
  let fixture: ComponentFixture<ViewbusinessuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewbusinessuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbusinessuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
