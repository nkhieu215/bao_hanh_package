import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPhanTichLoi, PhanTichLoi } from '../phan-tich-loi.model';
import { PhanTichLoiService } from '../service/phan-tich-loi.service';

import { PhanTichLoiRoutingResolveService } from './phan-tich-loi-routing-resolve.service';

describe('PhanTichLoi routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PhanTichLoiRoutingResolveService;
  let service: PhanTichLoiService;
  let resultPhanTichLoi: IPhanTichLoi | undefined;

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
    routingResolveService = TestBed.inject(PhanTichLoiRoutingResolveService);
    service = TestBed.inject(PhanTichLoiService);
    resultPhanTichLoi = undefined;
  });

  describe('resolve', () => {
    it('should return IPhanTichLoi returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanTichLoi = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPhanTichLoi).toEqual({ id: 123 });
    });

    it('should return new IPhanTichLoi if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanTichLoi = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPhanTichLoi).toEqual(new PhanTichLoi());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PhanTichLoi })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPhanTichLoi = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPhanTichLoi).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
