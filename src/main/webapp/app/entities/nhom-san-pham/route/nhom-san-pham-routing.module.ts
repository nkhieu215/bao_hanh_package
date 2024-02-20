import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NhomSanPhamComponent } from '../list/nhom-san-pham.component';
import { NhomSanPhamDetailComponent } from '../detail/nhom-san-pham-detail.component';
import { NhomSanPhamUpdateComponent } from '../update/nhom-san-pham-update.component';
import { NhomSanPhamRoutingResolveService } from './nhom-san-pham-routing-resolve.service';

const nhomSanPhamRoute: Routes = [
  {
    path: '',
    component: NhomSanPhamComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NhomSanPhamDetailComponent,
    resolve: {
      nhomSanPham: NhomSanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NhomSanPhamUpdateComponent,
    resolve: {
      nhomSanPham: NhomSanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NhomSanPhamUpdateComponent,
    resolve: {
      nhomSanPham: NhomSanPhamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(nhomSanPhamRoute)],
  exports: [RouterModule],
})
export class NhomSanPhamRoutingModule {}
