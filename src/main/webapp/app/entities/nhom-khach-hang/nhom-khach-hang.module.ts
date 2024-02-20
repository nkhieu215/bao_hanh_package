import { AngularSlickgridModule, ContainerService } from 'angular-slickgrid';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NhomKhachHangComponent } from './list/nhom-khach-hang.component';
import { NhomKhachHangDetailComponent } from './detail/nhom-khach-hang-detail.component';
import { NhomKhachHangUpdateComponent } from './update/nhom-khach-hang-update.component';
import { NhomKhachHangDeleteDialogComponent } from './delete/nhom-khach-hang-delete-dialog.component';
import { NhomKhachHangRoutingModule } from './route/nhom-khach-hang-routing.module';

@NgModule({
  imports: [SharedModule, NhomKhachHangRoutingModule, AngularSlickgridModule],
  declarations: [NhomKhachHangComponent, NhomKhachHangDetailComponent, NhomKhachHangUpdateComponent, NhomKhachHangDeleteDialogComponent],
  entryComponents: [NhomKhachHangDeleteDialogComponent],
  providers: [ContainerService],
})
export class NhomKhachHangModule {}
