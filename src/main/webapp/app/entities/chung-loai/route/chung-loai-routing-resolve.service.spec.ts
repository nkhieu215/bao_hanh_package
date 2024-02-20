import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IChungLoai, ChungLoai } from '../chung-loai.model';
import { ChungLoaiService } from '../service/chung-loai.service';

import { ChungLoaiRoutingResolveService } from './chung-loai-routing-resolve.service';

describe('ChungLoai routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChungLoaiRoutingResolveService;
  let service: ChungLoaiService;
  let resultChungLoai: IChungLoai | undefined;

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
    routingResolveService = TestBed.inject(ChungLoaiRoutingResolveService);
    service = TestBed.inject(ChungLoaiService);
    resultChungLoai = undefined;
  });

  describe('resolve', () => {
    it('should return IChungLoai returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChungLoai = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChungLoai).toEqual({ id: 123 });
    });

    it('should return new IChungLoai if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChungLoai = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChungLoai).toEqual(new ChungLoai());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ChungLoai })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChungLoai = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChungLoai).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
