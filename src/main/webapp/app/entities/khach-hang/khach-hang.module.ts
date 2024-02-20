import { NgxPrintModule } from 'ngx-print';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KhachHangComponent } from './list/khach-hang.component';
import { KhachHangDetailComponent } from './detail/khach-hang-detail.component';
import { KhachHangUpdateComponent } from './update/khach-hang-update.component';
import { KhachHangDeleteDialogComponent } from './delete/khach-hang-delete-dialog.component';
import { KhachHangRoutingModule } from './route/khach-hang-routing.module';

@NgModule({
  imports: [SharedModule, KhachHangRoutingModule, NgxPrintModule],
  declarations: [KhachHangComponent, KhachHangDetailComponent, KhachHangUpdateComponent, KhachHangDeleteDialogComponent],
  entryComponents: [KhachHangDeleteDialogComponent],
})
export class KhachHangModule {}
