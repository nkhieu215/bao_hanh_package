import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PhanTichSanPhamComponent } from '../list/phan-tich-san-pham.component';
import { PhanTichSanPhamDetailComponent } from '../detail/phan-tich-san-pham-detail.component';
import { PhanTichSanPhamUpdateComponent } from '../update/phan-tich-san-pham-update.component';
import { PhanTichSanPhamRoutingResolveService } from './phan-tich-san-pham-routing-resolve.service';

const phanTichSanPhamRoute: Routes = [
  {
    path: '',
    component: PhanTichSanPhamComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PhanTichSanPhamDetailComponent,
    resolve: {
      phanTichSanPham: PhanTichSanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PhanTichSanPhamUpdateComponent,
    resolve: {
      phanTichSanPham: PhanTichSanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PhanTichSanPhamUpdateComponent,
    resolve: {
      phanTichSanPham: PhanTichSanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(phanTichSanPhamRoute)],
  exports: [RouterModule],
})
export class PhanTichSanPhamRoutingModule {}
