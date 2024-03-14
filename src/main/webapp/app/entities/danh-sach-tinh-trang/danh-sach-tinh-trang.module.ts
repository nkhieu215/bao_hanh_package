import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DanhSachTinhTrangComponent } from './list/danh-sach-tinh-trang.component';
import { DanhSachTinhTrangDetailComponent } from './detail/danh-sach-tinh-trang-detail.component';
import { DanhSachTinhTrangUpdateComponent } from './update/danh-sach-tinh-trang-update.component';
import { DanhSachTinhTrangDeleteDialogComponent } from './delete/danh-sach-tinh-trang-delete-dialog.component';
import { DanhSachTinhTrangRoutingModule } from './route/danh-sach-tinh-trang-routing.module';
import { AngularSlickgridModule, ContainerService } from 'angular-slickgrid';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@NgModule({
  imports: [SharedModule, DanhSachTinhTrangRoutingModule, AngularSlickgridModule],
  declarations: [
    DanhSachTinhTrangComponent,
    DanhSachTinhTrangDetailComponent,
    DanhSachTinhTrangUpdateComponent,
    DanhSachTinhTrangDeleteDialogComponent,
  ],
  entryComponents: [DanhSachTinhTrangDeleteDialogComponent],
  providers: [ContainerService, NavbarComponent],
})
export class DanhSachTinhTrangModule {}
