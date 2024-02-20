import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LoiComponent } from '../list/loi.component';
import { LoiDetailComponent } from '../detail/loi-detail.component';
import { LoiUpdateComponent } from '../update/loi-update.component';
import { LoiRoutingResolveService } from './loi-routing-resolve.service';

const loiRoute: Routes = [
  {
    path: '',
    component: LoiComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoiDetailComponent,
    resolve: {
      loi: LoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoiUpdateComponent,
    resolve: {
      loi: LoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoiUpdateComponent,
    resolve: {
      loi: LoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loiRoute)],
  exports: [RouterModule],
})
export class LoiRoutingModule {}
