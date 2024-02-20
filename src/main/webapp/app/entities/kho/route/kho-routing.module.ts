import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KhoComponent } from '../list/kho.component';
import { KhoDetailComponent } from '../detail/kho-detail.component';
import { KhoUpdateComponent } from '../update/kho-update.component';
import { KhoRoutingResolveService } from './kho-routing-resolve.service';

const khoRoute: Routes = [
  {
    path: '',
    component: KhoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KhoDetailComponent,
    resolve: {
      kho: KhoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KhoUpdateComponent,
    resolve: {
      kho: KhoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KhoUpdateComponent,
    resolve: {
      kho: KhoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(khoRoute)],
  exports: [RouterModule],
})
export class KhoRoutingModule {}
