import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChiTietSanPhamTiepNhanComponent } from '../list/chi-tiet-san-pham-tiep-nhan.component';
import { ChiTietSanPhamTiepNhanDetailComponent } from '../detail/chi-tiet-san-pham-tiep-nhan-detail.component';
import { ChiTietSanPhamTiepNhanUpdateComponent } from '../update/chi-tiet-san-pham-tiep-nhan-update.component';
import { ChiTietSanPhamTiepNhanRoutingResolveService } from './chi-tiet-san-pham-tiep-nhan-routing-resolve.service';

const chiTietSanPhamTiepNhanRoute: Routes = [
  {
    path: '',
    component: ChiTietSanPhamTiepNhanComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChiTietSanPhamTiepNhanDetailComponent,
    resolve: {
      chiTietSanPhamTiepNhan: ChiTietSanPhamTiepNhanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChiTietSanPhamTiepNhanUpdateComponent,
    resolve: {
      chiTietSanPhamTiepNhan: ChiTietSanPhamTiepNhanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChiTietSanPhamTiepNhanUpdateComponent,
    resolve: {
      chiTietSanPhamTiepNhan: ChiTietSanPhamTiepNhanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chiTietSanPhamTiepNhanRoute)],
  exports: [RouterModule],
})
export class ChiTietSanPhamTiepNhanRoutingModule {}
