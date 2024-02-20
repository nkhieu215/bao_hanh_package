import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKhachHang, KhachHang } from '../khach-hang.model';
import { KhachHangService } from '../service/khach-hang.service';

@Injectable({ providedIn: 'root' })
export class KhachHangRoutingResolveService implements Resolve<IKhachHang> {
  constructor(protected service: KhachHangService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKhachHang> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((khachHang: HttpResponse<KhachHang>) => {
          if (khachHang.body) {
            return of(khachHang.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new KhachHang());
  }
}
