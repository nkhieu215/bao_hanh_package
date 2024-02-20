import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChungLoaiComponent } from '../list/chung-loai.component';
import { ChungLoaiDetailComponent } from '../detail/chung-loai-detail.component';
import { ChungLoaiUpdateComponent } from '../update/chung-loai-update.component';
import { ChungLoaiRoutingResolveService } from './chung-loai-routing-resolve.service';

const chungLoaiRoute: Routes = [
  {
    path: '',
    component: ChungLoaiComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChungLoaiDetailComponent,
    resolve: {
      chungLoai: ChungLoaiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChungLoaiUpdateComponent,
    resolve: {
      chungLoai: ChungLoaiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChungLoaiUpdateComponent,
    resolve: {
      chungLoai: ChungLoaiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chungLoaiRoute)],
  exports: [RouterModule],
})
export class ChungLoaiRoutingModule {}
