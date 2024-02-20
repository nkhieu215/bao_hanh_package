import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITinhThanh, TinhThanh } from '../tinh-thanh.model';
import { TinhThanhService } from '../service/tinh-thanh.service';

import { TinhThanhRoutingResolveService } from './tinh-thanh-routing-resolve.service';

describe('TinhThanh routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TinhThanhRoutingResolveService;
  let service: TinhThanhService;
  let resultTinhThanh: ITinhThanh | undefined;

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
    routingResolveService = TestBed.inject(TinhThanhRoutingResolveService);
    service = TestBed.inject(TinhThanhService);
    resultTinhThanh = undefined;
  });

  describe('resolve', () => {
    it('should return ITinhThanh returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTinhThanh = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTinhThanh).toEqual({ id: 123 });
    });

    it('should return new ITinhThanh if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTinhThanh = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTinhThanh).toEqual(new TinhThanh());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TinhThanh })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTinhThanh = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTinhThanh).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
