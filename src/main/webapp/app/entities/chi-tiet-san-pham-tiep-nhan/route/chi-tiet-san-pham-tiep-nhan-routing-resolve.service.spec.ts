import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IChiTietSanPhamTiepNhan, ChiTietSanPhamTiepNhan } from '../chi-tiet-san-pham-tiep-nhan.model';
import { ChiTietSanPhamTiepNhanService } from '../service/chi-tiet-san-pham-tiep-nhan.service';

import { ChiTietSanPhamTiepNhanRoutingResolveService } from './chi-tiet-san-pham-tiep-nhan-routing-resolve.service';

describe('ChiTietSanPhamTiepNhan routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChiTietSanPhamTiepNhanRoutingResolveService;
  let service: ChiTietSanPhamTiepNhanService;
  let resultChiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan | undefined;

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
    routingResolveService = TestBed.inject(ChiTietSanPhamTiepNhanRoutingResolveService);
    service = TestBed.inject(ChiTietSanPhamTiepNhanService);
    resultChiTietSanPhamTiepNhan = undefined;
  });

  describe('resolve', () => {
    it('should return IChiTietSanPhamTiepNhan returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChiTietSanPhamTiepNhan = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChiTietSanPhamTiepNhan).toEqual({ id: 123 });
    });

    it('should return new IChiTietSanPhamTiepNhan if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChiTietSanPhamTiepNhan = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChiTietSanPhamTiepNhan).toEqual(new ChiTietSanPhamTiepNhan());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ChiTietSanPhamTiepNhan })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChiTietSanPhamTiepNhan = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChiTietSanPhamTiepNhan).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
