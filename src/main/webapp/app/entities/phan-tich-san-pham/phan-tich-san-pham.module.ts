import { NgxPrintModule } from 'ngx-print';
import { PhanTichThongTinSanPhamComponent } from './list/phan-tich-thong-tin-san-pham.component';

import { PhanTichMaTiepNhanComponent } from './list/phan-tich-ma-tiep-nhan.component';
import { AngularSlickgridModule, ContainerService } from 'angular-slickgrid';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PhanTichSanPhamComponent } from './list/phan-tich-san-pham.component';
import { PhanTichSanPhamDetailComponent } from './detail/phan-tich-san-pham-detail.component';
import { PhanTichSanPhamUpdateComponent } from './update/phan-tich-san-pham-update.component';
import { PhanTichSanPhamDeleteDialogComponent } from './delete/phan-tich-san-pham-delete-dialog.component';
import { PhanTichSanPhamRoutingModule } from './route/phan-tich-san-pham-routing.module';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@NgModule({
  imports: [SharedModule, PhanTichSanPhamRoutingModule, AngularSlickgridModule, NgxPrintModule],
  declarations: [
    PhanTichSanPhamComponent,
    PhanTichSanPhamDetailComponent,
    PhanTichSanPhamUpdateComponent,
    PhanTichSanPhamDeleteDialogComponent,
    PhanTichMaTiepNhanComponent,
    PhanTichThongTinSanPhamComponent,
  ],
  entryComponents: [PhanTichSanPhamDeleteDialogComponent],
  providers: [ContainerService, NavbarComponent],
})
export class PhanTichSanPhamModule {}
