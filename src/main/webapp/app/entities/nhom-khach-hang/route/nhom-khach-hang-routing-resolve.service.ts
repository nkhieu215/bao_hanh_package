import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INhomKhachHang, NhomKhachHang } from '../nhom-khach-hang.model';
import { NhomKhachHangService } from '../service/nhom-khach-hang.service';

@Injectable({ providedIn: 'root' })
export class NhomKhachHangRoutingResolveService implements Resolve<INhomKhachHang> {
  constructor(protected service: NhomKhachHangService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INhomKhachHang> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((nhomKhachHang: HttpResponse<NhomKhachHang>) => {
          if (nhomKhachHang.body) {
            return of(nhomKhachHang.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new NhomKhachHang());
  }
}
