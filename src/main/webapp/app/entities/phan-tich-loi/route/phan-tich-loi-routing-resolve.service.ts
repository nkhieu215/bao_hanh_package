import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPhanTichLoi, PhanTichLoi } from '../phan-tich-loi.model';
import { PhanTichLoiService } from '../service/phan-tich-loi.service';

@Injectable({ providedIn: 'root' })
export class PhanTichLoiRoutingResolveService implements Resolve<IPhanTichLoi> {
  constructor(protected service: PhanTichLoiService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPhanTichLoi> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((phanTichLoi: HttpResponse<PhanTichLoi>) => {
          if (phanTichLoi.body) {
            return of(phanTichLoi.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PhanTichLoi());
  }
}
