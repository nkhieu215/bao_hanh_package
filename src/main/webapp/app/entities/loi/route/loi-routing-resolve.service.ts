import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoi, Loi } from '../loi.model';
import { LoiService } from '../service/loi.service';

@Injectable({ providedIn: 'root' })
export class LoiRoutingResolveService implements Resolve<ILoi> {
  constructor(protected service: LoiService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoi> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loi: HttpResponse<Loi>) => {
          if (loi.body) {
            return of(loi.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Loi());
  }
}
