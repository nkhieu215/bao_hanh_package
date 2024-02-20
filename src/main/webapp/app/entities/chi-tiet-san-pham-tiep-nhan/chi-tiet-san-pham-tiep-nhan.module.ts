import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChiTietSanPhamTiepNhanComponent } from './list/chi-tiet-san-pham-tiep-nhan.component';
import { ChiTietSanPhamTiepNhanDetailComponent } from './detail/chi-tiet-san-pham-tiep-nhan-detail.component';
import { ChiTietSanPhamTiepNhanUpdateComponent } from './update/chi-tiet-san-pham-tiep-nhan-update.component';
import { ChiTietSanPhamTiepNhanDeleteDialogComponent } from './delete/chi-tiet-san-pham-tiep-nhan-delete-dialog.component';
import { ChiTietSanPhamTiepNhanRoutingModule } from './route/chi-tiet-san-pham-tiep-nhan-routing.module';

@NgModule({
  imports: [SharedModule, ChiTietSanPhamTiepNhanRoutingModule],
  declarations: [
    ChiTietSanPhamTiepNhanComponent,
    ChiTietSanPhamTiepNhanDetailComponent,
    ChiTietSanPhamTiepNhanUpdateComponent,
    ChiTietSanPhamTiepNhanDeleteDialogComponent,
  ],
  entryComponents: [ChiTietSanPhamTiepNhanDeleteDialogComponent],
})
export class ChiTietSanPhamTiepNhanModule {}
