import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NhomLoiComponent } from '../list/nhom-loi.component';
import { NhomLoiDetailComponent } from '../detail/nhom-loi-detail.component';
import { NhomLoiUpdateComponent } from '../update/nhom-loi-update.component';
import { NhomLoiRoutingResolveService } from './nhom-loi-routing-resolve.service';

const nhomLoiRoute: Routes = [
  {
    path: '',
    component: NhomLoiComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NhomLoiDetailComponent,
    resolve: {
      nhomLoi: NhomLoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NhomLoiUpdateComponent,
    resolve: {
      nhomLoi: NhomLoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NhomLoiUpdateComponent,
    resolve: {
      nhomLoi: NhomLoiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(nhomLoiRoute)],
  exports: [RouterModule],
})
export class NhomLoiRoutingModule {}
