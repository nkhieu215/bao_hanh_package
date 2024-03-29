import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChiTietSanPhamTiepNhanComponent } from './list/chi-tiet-san-pham-tiep-nhan.component';
import { ChiTietSanPhamTiepNhanDetailComponent } from './detail/chi-tiet-san-pham-tiep-nhan-detail.component';
import { ChiTietSanPhamTiepNhanUpdateComponent } from './update/chi-tiet-san-pham-tiep-nhan-update.component';
import { ChiTietSanPhamTiepNhanDeleteDialogComponent } from './delete/chi-tiet-san-pham-tiep-nhan-delete-dialog.component';
import { ChiTietSanPhamTiepNhanRoutingModule } from './route/chi-tiet-san-pham-tiep-nhan-routing.module';
import { AngularSlickgridModule, ContainerService } from 'angular-slickgrid';
import { RowDetailViewComponent } from '../don-bao-hanh/list/rowdetail-view.component';
import Sortable from 'sortablejs';
import { ChiTietBaoCaoTongHopComponent } from './list/chi-tiet-bao-cao-tong-hop.component';

@NgModule({
  imports: [SharedModule, ChiTietSanPhamTiepNhanRoutingModule, AngularSlickgridModule],
  declarations: [
    ChiTietSanPhamTiepNhanComponent,
    ChiTietSanPhamTiepNhanDetailComponent,
    ChiTietSanPhamTiepNhanUpdateComponent,
    ChiTietSanPhamTiepNhanDeleteDialogComponent,
    ChiTietBaoCaoTongHopComponent
  ],
  entryComponents: [ChiTietSanPhamTiepNhanDeleteDialogComponent],
  providers: [ContainerService, RowDetailViewComponent, ChiTietBaoCaoTongHopComponent],
})
export class ChiTietSanPhamTiepNhanModule {}
