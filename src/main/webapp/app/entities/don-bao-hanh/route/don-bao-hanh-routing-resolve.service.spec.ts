import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDonBaoHanh, DonBaoHanh } from '../don-bao-hanh.model';
import { DonBaoHanhService } from '../service/don-bao-hanh.service';

import { DonBaoHanhRoutingResolveService } from './don-bao-hanh-routing-resolve.service';

describe('DonBaoHanh routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DonBaoHanhRoutingResolveService;
  let service: DonBaoHanhService;
  let resultDonBaoHanh: IDonBaoHanh | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(DonBaoHanhRoutingResolveService);
    service = TestBed.inject(DonBaoHanhService);
    resultDonBaoHanh = undefined;
  });

  describe('resolve', () => {
    it('should return IDonBaoHanh returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDonBaoHanh = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDonBaoHanh).toEqual({ id: 123 });
    });

    it('should return new IDonBaoHanh if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDonBaoHanh = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDonBaoHanh).toEqual(new DonBaoHanh());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as DonBaoHanh })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDonBaoHanh = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDonBaoHanh).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
