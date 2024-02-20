import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPhanLoaiChiTietTiepNhan, PhanLoaiChiTietTiepNhan } from '../phan-loai-chi-tiet-tiep-nhan.model';
import { PhanLoaiChiTietTiepNhanService } from '../service/phan-loai-chi-tiet-tiep-nhan.service';

import { PhanLoaiChiTietTiepNhanRoutingResolveService } from './phan-loai-chi-tiet-tiep-nhan-routing-resolve.service';

describe('PhanLoaiChiTietTiepNhan routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PhanLoaiChiTietTiepNhanRoutingResolveService;
  let service: PhanLoaiChiTietTiepNhanService;
  let resultPhanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan | undefined;

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
    routingResolveService = TestBed.inject(PhanLoaiChiTietTiepNhanRoutingResolveService);
    service = TestBed.inject(PhanLoaiChiTietTiepNhanService);
    resultPhanLoaiChiTietTiepNhan = undefined;
  });

  describe('resolve', () => {
    it('should return IPhanLoaiChiTietTiepNhan returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanLoaiChiTietTiepNhan = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPhanLoaiChiTietTiepNhan).toEqual({ id: 123 });
    });

    it('should return new IPhanLoaiChiTietTiepNhan if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanLoaiChiTietTiepNhan = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPhanLoaiChiTietTiepNhan).toEqual(new PhanLoaiChiTietTiepNhan());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PhanLoaiChiTietTiepNhan })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanLoaiChiTietTiepNhan = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPhanLoaiChiTietTiepNhan).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
