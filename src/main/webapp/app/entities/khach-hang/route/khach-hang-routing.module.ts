import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KhachHangComponent } from '../list/khach-hang.component';
import { KhachHangDetailComponent } from '../detail/khach-hang-detail.component';
import { KhachHangUpdateComponent } from '../update/khach-hang-update.component';
import { KhachHangRoutingResolveService } from './khach-hang-routing-resolve.service';

const khachHangRoute: Routes = [
  {
    path: '',
    component: KhachHangComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KhachHangDetailComponent,
    resolve: {
      khachHang: KhachHangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KhachHangUpdateComponent,
    resolve: {
      khachHang: KhachHangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KhachHangUpdateComponent,
    resolve: {
      khachHang: KhachHangRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(khachHangRoute)],
  exports: [RouterModule],
})
export class KhachHangRoutingModule {}
