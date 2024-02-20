import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITinhThanh, TinhThanh } from '../tinh-thanh.model';
import { TinhThanhService } from '../service/tinh-thanh.service';

@Injectable({ providedIn: 'root' })
export class TinhThanhRoutingResolveService implements Resolve<ITinhThanh> {
  constructor(protected service: TinhThanhService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITinhThanh> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tinhThanh: HttpResponse<TinhThanh>) => {
          if (tinhThanh.body) {
            return of(tinhThanh.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TinhThanh());
  }
}
