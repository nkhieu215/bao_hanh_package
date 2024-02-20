import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKho, Kho } from '../kho.model';
import { KhoService } from '../service/kho.service';

@Injectable({ providedIn: 'root' })
export class KhoRoutingResolveService implements Resolve<IKho> {
  constructor(protected service: KhoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKho> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((kho: HttpResponse<Kho>) => {
          if (kho.body) {
            return of(kho.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Kho());
  }
}
