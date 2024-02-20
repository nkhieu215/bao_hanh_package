import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { INhomLoi, NhomLoi } from '../nhom-loi.model';
import { NhomLoiService } from '../service/nhom-loi.service';

import { NhomLoiRoutingResolveService } from './nhom-loi-routing-resolve.service';

describe('NhomLoi routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: NhomLoiRoutingResolveService;
  let service: NhomLoiService;
  let resultNhomLoi: INhomLoi | undefined;

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
    routingResolveService = TestBed.inject(NhomLoiRoutingResolveService);
    service = TestBed.inject(NhomLoiService);
    resultNhomLoi = undefined;
  });

  describe('resolve', () => {
    it('should return INhomLoi returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNhomLoi = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNhomLoi).toEqual({ id: 123 });
    });

    it('should return new INhomLoi if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNhomLoi = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultNhomLoi).toEqual(new NhomLoi());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as NhomLoi })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNhomLoi = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNhomLoi).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
