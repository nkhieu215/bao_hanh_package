import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NganhComponent } from '../list/nganh.component';
import { NganhDetailComponent } from '../detail/nganh-detail.component';
import { NganhUpdateComponent } from '../update/nganh-update.component';
import { NganhRoutingResolveService } from './nganh-routing-resolve.service';

const nganhRoute: Routes = [
  {
    path: '',
    component: NganhComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NganhDetailComponent,
    resolve: {
      nganh: NganhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NganhUpdateComponent,
    resolve: {
      nganh: NganhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NganhUpdateComponent,
    resolve: {
      nganh: NganhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(nganhRoute)],
  exports: [RouterModule],
})
export class NganhRoutingModule {}
