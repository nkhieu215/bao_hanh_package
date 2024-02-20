import { AngularSlickgridModule, ContainerService } from 'angular-slickgrid';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PhanLoaiChiTietTiepNhanComponent } from './list/phan-loai-chi-tiet-tiep-nhan.component';
import { PhanLoaiChiTietTiepNhanDetailComponent } from './detail/phan-loai-chi-tiet-tiep-nhan-detail.component';
import { PhanLoaiChiTietTiepNhanUpdateComponent } from './update/phan-loai-chi-tiet-tiep-nhan-update.component';
import { PhanLoaiChiTietTiepNhanDeleteDialogComponent } from './delete/phan-loai-chi-tiet-tiep-nhan-delete-dialog.component';
import { PhanLoaiChiTietTiepNhanRoutingModule } from './route/phan-loai-chi-tiet-tiep-nhan-routing.module';

@NgModule({
  imports: [SharedModule, PhanLoaiChiTietTiepNhanRoutingModule, AngularSlickgridModule],
  declarations: [
    PhanLoaiChiTietTiepNhanComponent,
    PhanLoaiChiTietTiepNhanDetailComponent,
    PhanLoaiChiTietTiepNhanUpdateComponent,
    PhanLoaiChiTietTiepNhanDeleteDialogComponent,
  ],
  entryComponents: [PhanLoaiChiTietTiepNhanDeleteDialogComponent],
  providers: [ContainerService],
})
export class PhanLoaiChiTietTiepNhanModule {}
