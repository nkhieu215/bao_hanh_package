import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PhanTichLoiComponent } from './list/phan-tich-loi.component';
import { PhanTichLoiDetailComponent } from './detail/phan-tich-loi-detail.component';
import { PhanTichLoiUpdateComponent } from './update/phan-tich-loi-update.component';
import { PhanTichLoiDeleteDialogComponent } from './delete/phan-tich-loi-delete-dialog.component';
import { PhanTichLoiRoutingModule } from './route/phan-tich-loi-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [SharedModule, PhanTichLoiRoutingModule, NgxPaginationModule],
  declarations: [PhanTichLoiComponent, PhanTichLoiDetailComponent, PhanTichLoiUpdateComponent, PhanTichLoiDeleteDialogComponent],
  entryComponents: [PhanTichLoiDeleteDialogComponent],
})
export class PhanTichLoiModule {}
