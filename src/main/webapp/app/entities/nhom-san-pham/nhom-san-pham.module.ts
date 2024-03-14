import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NhomSanPhamComponent } from './list/nhom-san-pham.component';
import { NhomSanPhamDetailComponent } from './detail/nhom-san-pham-detail.component';
import { NhomSanPhamUpdateComponent } from './update/nhom-san-pham-update.component';
import { NhomSanPhamDeleteDialogComponent } from './delete/nhom-san-pham-delete-dialog.component';
import { NhomSanPhamRoutingModule } from './route/nhom-san-pham-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@NgModule({
  imports: [SharedModule, NhomSanPhamRoutingModule, NgxPaginationModule],
  declarations: [NhomSanPhamComponent, NhomSanPhamDetailComponent, NhomSanPhamUpdateComponent, NhomSanPhamDeleteDialogComponent],
  entryComponents: [NhomSanPhamDeleteDialogComponent, NavbarComponent],
  providers: [NavbarComponent],
})
export class NhomSanPhamModule {}
