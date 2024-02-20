import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChiTietSanPhamTiepNhan, ChiTietSanPhamTiepNhan } from '../chi-tiet-san-pham-tiep-nhan.model';
import { ChiTietSanPhamTiepNhanService } from '../service/chi-tiet-san-pham-tiep-nhan.service';

@Injectable({ providedIn: 'root' })
export class ChiTietSanPhamTiepNhanRoutingResolveService implements Resolve<IChiTietSanPhamTiepNhan> {
  constructor(protected service: ChiTietSanPhamTiepNhanService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChiTietSanPhamTiepNhan> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chiTietSanPhamTiepNhan: HttpResponse<ChiTietSanPhamTiepNhan>) => {
          if (chiTietSanPhamTiepNhan.body) {
            return of(chiTietSanPhamTiepNhan.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChiTietSanPhamTiepNhan());
  }
}
