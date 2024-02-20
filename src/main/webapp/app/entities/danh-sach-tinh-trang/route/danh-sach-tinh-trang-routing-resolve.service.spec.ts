import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDanhSachTinhTrang, DanhSachTinhTrang } from '../danh-sach-tinh-trang.model';
import { DanhSachTinhTrangService } from '../service/danh-sach-tinh-trang.service';

import { DanhSachTinhTrangRoutingResolveService } from './danh-sach-tinh-trang-routing-resolve.service';

describe('DanhSachTinhTrang routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DanhSachTinhTrangRoutingResolveService;
  let service: DanhSachTinhTrangService;
  let resultDanhSachTinhTrang: IDanhSachTinhTrang | undefined;

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
    routingResolveService = TestBed.inject(DanhSachTinhTrangRoutingResolveService);
    service = TestBed.inject(DanhSachTinhTrangService);
    resultDanhSachTinhTrang = undefined;
  });

  describe('resolve', () => {
    it('should return IDanhSachTinhTrang returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDanhSachTinhTrang = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDanhSachTinhTrang).toEqual({ id: 123 });
    });

    it('should return new IDanhSachTinhTrang if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDanhSachTinhTrang = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDanhSachTinhTrang).toEqual(new DanhSachTinhTrang());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as DanhSachTinhTrang })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDanhSachTinhTrang = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDanhSachTinhTrang).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
