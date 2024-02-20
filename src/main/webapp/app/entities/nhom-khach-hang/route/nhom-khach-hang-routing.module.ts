import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NhomKhachHangComponent } from '../list/nhom-khach-hang.component';
import { NhomKhachHangDetailComponent } from '../detail/nhom-khach-hang-detail.component';
import { NhomKhachHangUpdateComponent } from '../update/nhom-khach-hang-update.component';
import { NhomKhachHangRoutingResolveService } from './nhom-khach-hang-routing-resolve.service';

const nhomKhachHangRoute: Routes = [
  {
    path: '',
    component: NhomKhachHangComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NhomKhachHangDetailComponent,
    resolve: {
      nhomKhachHang: NhomKhachHangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NhomKhachHangUpdateComponent,
    resolve: {
      nhomKhachHang: NhomKhachHangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NhomKhachHangUpdateComponent,
    resolve: {
      nhomKhachHang: NhomKhachHangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(nhomKhachHangRoute)],
  exports: [RouterModule],
})
export class NhomKhachHangRoutingModule {}
