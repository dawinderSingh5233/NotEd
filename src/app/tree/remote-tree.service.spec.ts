import { TestBed } from '@angular/core/testing';

import { RemoteTreeService } from './remote-tree.service';

describe('RemoteTreeService', () => {
  let service: RemoteTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
