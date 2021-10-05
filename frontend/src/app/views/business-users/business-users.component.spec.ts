import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUsersComponent } from './business-users.component';

describe('BusinessUsersComponent', () => {
  let component: BusinessUsersComponent;
  let fixture: ComponentFixture<BusinessUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
