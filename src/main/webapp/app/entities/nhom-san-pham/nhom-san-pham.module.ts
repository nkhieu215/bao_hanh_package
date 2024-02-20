import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NhomSanPhamComponent } from './list/nhom-san-pham.component';
import { NhomSanPhamDetailComponent } from './detail/nhom-san-pham-detail.component';
import { NhomSanPhamUpdateComponent } from './update/nhom-san-pham-update.component';
import { NhomSanPhamDeleteDialogComponent } from './delete/nhom-san-pham-delete-dialog.component';
import { NhomSanPhamRoutingModule } from './route/nhom-san-pham-routing.module';

@NgModule({
  imports: [SharedModule, NhomSanPhamRoutingModule],
  declarations: [NhomSanPhamComponent, NhomSanPhamDetailComponent, NhomSanPhamUpdateComponent, NhomSanPhamDeleteDialogComponent],
  entryComponents: [NhomSanPhamDeleteDialogComponent],
})
export class NhomSanPhamModule {}
