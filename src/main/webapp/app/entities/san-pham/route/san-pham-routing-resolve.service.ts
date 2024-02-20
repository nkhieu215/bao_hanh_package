import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISanPham, SanPham } from '../san-pham.model';
import { SanPhamService } from '../service/san-pham.service';

@Injectable({ providedIn: 'root' })
export class SanPhamRoutingResolveService implements Resolve<ISanPham> {
  constructor(protected service: SanPhamService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISanPham> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sanPham: HttpResponse<SanPham>) => {
          if (sanPham.body) {
            return of(sanPham.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SanPham());
  }
}
