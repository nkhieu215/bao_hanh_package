import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INhomSanPham, NhomSanPham } from '../nhom-san-pham.model';
import { NhomSanPhamService } from '../service/nhom-san-pham.service';

@Injectable({ providedIn: 'root' })
export class NhomSanPhamRoutingResolveService implements Resolve<INhomSanPham> {
  constructor(protected service: NhomSanPhamService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INhomSanPham> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((nhomSanPham: HttpResponse<NhomSanPham>) => {
          if (nhomSanPham.body) {
            return of(nhomSanPham.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new NhomSanPham());
  }
}
