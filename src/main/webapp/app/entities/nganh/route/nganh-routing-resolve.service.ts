import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INganh, Nganh } from '../nganh.model';
import { NganhService } from '../service/nganh.service';

@Injectable({ providedIn: 'root' })
export class NganhRoutingResolveService implements Resolve<INganh> {
  constructor(protected service: NganhService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INganh> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((nganh: HttpResponse<Nganh>) => {
          if (nganh.body) {
            return of(nganh.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Nganh());
  }
}
