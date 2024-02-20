import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PhanLoaiChiTietTiepNhanComponent } from '../list/phan-loai-chi-tiet-tiep-nhan.component';
import { PhanLoaiChiTietTiepNhanDetailComponent } from '../detail/phan-loai-chi-tiet-tiep-nhan-detail.component';
import { PhanLoaiChiTietTiepNhanUpdateComponent } from '../update/phan-loai-chi-tiet-tiep-nhan-update.component';
import { PhanLoaiChiTietTiepNhanRoutingResolveService } from './phan-loai-chi-tiet-tiep-nhan-routing-resolve.service';

const phanLoaiChiTietTiepNhanRoute: Routes = [
  {
    path: '',
    component: PhanLoaiChiTietTiepNhanComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PhanLoaiChiTietTiepNhanDetailComponent,
    resolve: {
      phanLoaiChiTietTiepNhan: PhanLoaiChiTietTiepNhanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PhanLoaiChiTietTiepNhanUpdateComponent,
    resolve: {
      phanLoaiChiTietTiepNhan: PhanLoaiChiTietTiepNhanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PhanLoaiChiTietTiepNhanUpdateComponent,
    resolve: {
      phanLoaiChiTietTiepNhan: PhanLoaiChiTietTiepNhanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(phanLoaiChiTietTiepNhanRoute)],
  exports: [RouterModule],
})
export class PhanLoaiChiTietTiepNhanRoutingModule {}
