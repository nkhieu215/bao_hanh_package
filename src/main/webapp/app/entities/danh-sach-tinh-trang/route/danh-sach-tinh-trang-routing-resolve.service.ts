import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDanhSachTinhTrang, DanhSachTinhTrang } from '../danh-sach-tinh-trang.model';
import { DanhSachTinhTrangService } from '../service/danh-sach-tinh-trang.service';

@Injectable({ providedIn: 'root' })
export class DanhSachTinhTrangRoutingResolveService implements Resolve<IDanhSachTinhTrang> {
  constructor(protected service: DanhSachTinhTrangService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDanhSachTinhTrang> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((danhSachTinhTrang: HttpResponse<DanhSachTinhTrang>) => {
          if (danhSachTinhTrang.body) {
            return of(danhSachTinhTrang.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DanhSachTinhTrang());
  }
}
