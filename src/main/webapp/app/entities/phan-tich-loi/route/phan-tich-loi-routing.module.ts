import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PhanTichLoiComponent } from '../list/phan-tich-loi.component';
import { PhanTichLoiDetailComponent } from '../detail/phan-tich-loi-detail.component';
import { PhanTichLoiUpdateComponent } from '../update/phan-tich-loi-update.component';
import { PhanTichLoiRoutingResolveService } from './phan-tich-loi-routing-resolve.service';

const phanTichLoiRoute: Routes = [
  {
    path: '',
    component: PhanTichLoiComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PhanTichLoiDetailComponent,
    resolve: {
      phanTichLoi: PhanTichLoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PhanTichLoiUpdateComponent,
    resolve: {
      phanTichLoi: PhanTichLoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PhanTichLoiUpdateComponent,
    resolve: {
      phanTichLoi: PhanTichLoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(phanTichLoiRoute)],
  exports: [RouterModule],
})
export class PhanTichLoiRoutingModule {}
