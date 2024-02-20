import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TinhThanhComponent } from '../list/tinh-thanh.component';
import { TinhThanhDetailComponent } from '../detail/tinh-thanh-detail.component';
import { TinhThanhUpdateComponent } from '../update/tinh-thanh-update.component';
import { TinhThanhRoutingResolveService } from './tinh-thanh-routing-resolve.service';

const tinhThanhRoute: Routes = [
  {
    path: '',
    component: TinhThanhComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TinhThanhDetailComponent,
    resolve: {
      tinhThanh: TinhThanhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TinhThanhUpdateComponent,
    resolve: {
      tinhThanh: TinhThanhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TinhThanhUpdateComponent,
    resolve: {
      tinhThanh: TinhThanhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tinhThanhRoute)],
  exports: [RouterModule],
})
export class TinhThanhRoutingModule {}
