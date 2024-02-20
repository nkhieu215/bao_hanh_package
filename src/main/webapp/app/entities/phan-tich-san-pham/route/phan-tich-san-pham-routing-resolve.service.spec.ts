import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPhanTichSanPham, PhanTichSanPham } from '../phan-tich-san-pham.model';
import { PhanTichSanPhamService } from '../service/phan-tich-san-pham.service';

import { PhanTichSanPhamRoutingResolveService } from './phan-tich-san-pham-routing-resolve.service';

describe('PhanTichSanPham routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PhanTichSanPhamRoutingResolveService;
  let service: PhanTichSanPhamService;
  let resultPhanTichSanPham: IPhanTichSanPham | undefined;

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
    routingResolveService = TestBed.inject(PhanTichSanPhamRoutingResolveService);
    service = TestBed.inject(PhanTichSanPhamService);
    resultPhanTichSanPham = undefined;
  });

  describe('resolve', () => {
    it('should return IPhanTichSanPham returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanTichSanPham = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPhanTichSanPham).toEqual({ id: 123 });
    });

    it('should return new IPhanTichSanPham if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanTichSanPham = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPhanTichSanPham).toEqual(new PhanTichSanPham());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PhanTichSanPham })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanTichSanPham = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPhanTichSanPham).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
