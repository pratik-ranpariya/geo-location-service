import { TestBed } from '@angular/core/testing';

import { BusinessUsersService } from './business-users.service';

describe('BusinessUsersService', () => {
  let service: BusinessUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
