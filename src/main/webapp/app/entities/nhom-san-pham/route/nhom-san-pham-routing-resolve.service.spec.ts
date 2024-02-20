import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { INhomSanPham, NhomSanPham } from '../nhom-san-pham.model';
import { NhomSanPhamService } from '../service/nhom-san-pham.service';

import { NhomSanPhamRoutingResolveService } from './nhom-san-pham-routing-resolve.service';

describe('NhomSanPham routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: NhomSanPhamRoutingResolveService;
  let service: NhomSanPhamService;
  let resultNhomSanPham: INhomSanPham | undefined;

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
    routingResolveService = TestBed.inject(NhomSanPhamRoutingResolveService);
    service = TestBed.inject(NhomSanPhamService);
    resultNhomSanPham = undefined;
  });

  describe('resolve', () => {
    it('should return INhomSanPham returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNhomSanPham = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNhomSanPham).toEqual({ id: 123 });
    });

    it('should return new INhomSanPham if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNhomSanPham = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultNhomSanPham).toEqual(new NhomSanPham());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as NhomSanPham })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNhomSanPham = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNhomSanPham).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
