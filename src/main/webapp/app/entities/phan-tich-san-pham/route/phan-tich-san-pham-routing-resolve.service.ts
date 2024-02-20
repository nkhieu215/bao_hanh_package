import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPhanTichSanPham, PhanTichSanPham } from '../phan-tich-san-pham.model';
import { PhanTichSanPhamService } from '../service/phan-tich-san-pham.service';

@Injectable({ providedIn: 'root' })
export class PhanTichSanPhamRoutingResolveService implements Resolve<IPhanTichSanPham> {
  constructor(protected service: PhanTichSanPhamService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPhanTichSanPham> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((phanTichSanPham: HttpResponse<PhanTichSanPham>) => {
          if (phanTichSanPham.body) {
            return of(phanTichSanPham.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PhanTichSanPham());
  }
}
