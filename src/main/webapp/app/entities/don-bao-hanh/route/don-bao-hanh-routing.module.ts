import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DonBaoHanhComponent } from '../list/don-bao-hanh.component';
import { DonBaoHanhDetailComponent } from '../detail/don-bao-hanh-detail.component';
import { DonBaoHanhUpdateComponent } from '../update/don-bao-hanh-update.component';
import { DonBaoHanhRoutingResolveService } from './don-bao-hanh-routing-resolve.service';

const donBaoHanhRoute: Routes = [
  {
    path: '',
    component: DonBaoHanhComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DonBaoHanhDetailComponent,
    resolve: {
      donBaoHanh: DonBaoHanhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DonBaoHanhUpdateComponent,
    resolve: {
      donBaoHanh: DonBaoHanhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DonBaoHanhUpdateComponent,
    resolve: {
      donBaoHanh: DonBaoHanhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(donBaoHanhRoute)],
  exports: [RouterModule],
})
export class DonBaoHanhRoutingModule {}
