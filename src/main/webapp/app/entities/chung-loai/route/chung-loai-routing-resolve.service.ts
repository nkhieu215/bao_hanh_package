import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChungLoai, ChungLoai } from '../chung-loai.model';
import { ChungLoaiService } from '../service/chung-loai.service';

@Injectable({ providedIn: 'root' })
export class ChungLoaiRoutingResolveService implements Resolve<IChungLoai> {
  constructor(protected service: ChungLoaiService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChungLoai> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chungLoai: HttpResponse<ChungLoai>) => {
          if (chungLoai.body) {
            return of(chungLoai.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChungLoai());
  }
}
