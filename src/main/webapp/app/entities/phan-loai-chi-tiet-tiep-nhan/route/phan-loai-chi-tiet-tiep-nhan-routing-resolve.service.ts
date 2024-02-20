import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPhanLoaiChiTietTiepNhan, PhanLoaiChiTietTiepNhan } from '../phan-loai-chi-tiet-tiep-nhan.model';
import { PhanLoaiChiTietTiepNhanService } from '../service/phan-loai-chi-tiet-tiep-nhan.service';

@Injectable({ providedIn: 'root' })
export class PhanLoaiChiTietTiepNhanRoutingResolveService implements Resolve<IPhanLoaiChiTietTiepNhan> {
  constructor(protected service: PhanLoaiChiTietTiepNhanService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPhanLoaiChiTietTiepNhan> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((phanLoaiChiTietTiepNhan: HttpResponse<PhanLoaiChiTietTiepNhan>) => {
          if (phanLoaiChiTietTiepNhan.body) {
            return of(phanLoaiChiTietTiepNhan.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PhanLoaiChiTietTiepNhan());
  }
}
