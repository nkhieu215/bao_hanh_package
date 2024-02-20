import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDonBaoHanh, DonBaoHanh } from '../don-bao-hanh.model';
import { DonBaoHanhService } from '../service/don-bao-hanh.service';

@Injectable({ providedIn: 'root' })
export class DonBaoHanhRoutingResolveService implements Resolve<IDonBaoHanh> {
  constructor(protected service: DonBaoHanhService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDonBaoHanh> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((donBaoHanh: HttpResponse<DonBaoHanh>) => {
          if (donBaoHanh.body) {
            return of(donBaoHanh.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DonBaoHanh());
  }
}
