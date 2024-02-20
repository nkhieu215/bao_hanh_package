import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DanhSachTinhTrangComponent } from '../list/danh-sach-tinh-trang.component';
import { DanhSachTinhTrangDetailComponent } from '../detail/danh-sach-tinh-trang-detail.component';
import { DanhSachTinhTrangUpdateComponent } from '../update/danh-sach-tinh-trang-update.component';
import { DanhSachTinhTrangRoutingResolveService } from './danh-sach-tinh-trang-routing-resolve.service';

const danhSachTinhTrangRoute: Routes = [
  {
    path: '',
    component: DanhSachTinhTrangComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DanhSachTinhTrangDetailComponent,
    resolve: {
      danhSachTinhTrang: DanhSachTinhTrangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DanhSachTinhTrangUpdateComponent,
    resolve: {
      danhSachTinhTrang: DanhSachTinhTrangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DanhSachTinhTrangUpdateComponent,
    resolve: {
      danhSachTinhTrang: DanhSachTinhTrangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(danhSachTinhTrangRoute)],
  exports: [RouterModule],
})
export class DanhSachTinhTrangRoutingModule {}
