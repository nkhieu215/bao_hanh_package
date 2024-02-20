import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SanPhamComponent } from '../list/san-pham.component';
import { SanPhamDetailComponent } from '../detail/san-pham-detail.component';
import { SanPhamUpdateComponent } from '../update/san-pham-update.component';
import { SanPhamRoutingResolveService } from './san-pham-routing-resolve.service';

const sanPhamRoute: Routes = [
  {
    path: '',
    component: SanPhamComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SanPhamDetailComponent,
    resolve: {
      sanPham: SanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SanPhamUpdateComponent,
    resolve: {
      sanPham: SanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SanPhamUpdateComponent,
    resolve: {
      sanPham: SanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sanPhamRoute)],
  exports: [RouterModule],
})
export class SanPhamRoutingModule {}
